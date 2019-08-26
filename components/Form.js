import React, { Component } from 'react';

export default class Form extends React.Component {
    constructor(props) {
        super(props);

		this.state = {
            user: {
                name: '',
                tel: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                country: '',
                dialCode: '',
                isMailingChecked: false,
            },
            countriesData: [],
            formErrors: {name: '', email: '', password: '', country: '', dialCode: ''},
            nameValid: false,
            emailValid: false,
            passwordValid: false,
            countryValid: false,
            dialCodeValid: false,
            formValid: false,
            status: false,
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit =this.handleSubmit.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount() {
        this.fetchCountriesData();
    }

    async fetchCountriesData() {
        const json = await fetch('http://localhost:3002/countries');
        const data = await json.json();
        const countriesData = [];
        data.forEach((item) => {
            countriesData.push([item.country_code, item.dial_code]);
        });

        this.setState({
            countriesData: countriesData
        });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }},
            () => { this.validateField(name, value);
        });
    }

    validateField(fieldName, value) {
        
        let fieldValidationErrors = this.state.formErrors;
        let { nameValid, emailValid, passwordValid, countryValid, dialCodeValid} = this.state;
        const { user } = this.state;

        const checkPasswordEqual = function() {
            let passwordEqual = passwordValid && (user.password === user.passwordConfirmation);
            fieldValidationErrors.password = passwordEqual ? '' : ' do not match';
        }

        switch(fieldName) {
            case 'name':
                nameValid = !!value.match('^[a-z ,.\'-]+$', 'i') && value.length > 3 && value.length < 30;
                fieldValidationErrors.name = nameValid ? '' : ' is invalid';
                break;
            case 'dialCode':
                dialCodeValid = !!value.match('^\\+?\\d{1,4}$');
                fieldValidationErrors.name = dialCodeValid ? '' : ' is invalid';
                break;
            case 'email':
                emailValid = !!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'country':
                countryValid = ['UK', 'US'].indexOf(value) !== -1;
                fieldValidationErrors.country = countryValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length > 5 && value.length < 128;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                checkPasswordEqual();
                break;
            case 'passwordConfirmation':
                checkPasswordEqual();
                break;
            default:
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            nameValid: nameValid,
            passwordValid: passwordValid,
            dialCodeValid: dialCodeValid,
            emailValid: emailValid,
            countryValid: countryValid
            },
            this.validateForm);
      }

    validateForm() {
        this.setState({formValid: this.state.emailValid &&
                                  this.state.passwordValid &&
                                  this.state.nameValid &&
                                  this.state.countryValid &&
                                  this.state.dialCodeValid});
    }

    handleSubmit(e) {
        e.preventDefault();

        const { user } = this.state;
        if (this.state.formValid) {
            this.registerUser(user);
        }
    }

    registerUser(user) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };

        return fetch('http://localhost:3002/register', requestOptions).then(this.handleResponse);
    }

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;

                return Promise.reject(error);
            }

            this.setState({
                status: true
            });
            
            return data;
        });
    }

    render() {

        const { user } = this.state;

        return (
            <form className='signUpForm' onSubmit={this.handleSubmit}>
                <h1 className='heading'>Sign Up</h1>

                <div className={`formItem ${this.state.formErrors.name.length === 0 ? '' : 'error'}`}>
                    <input type='text'
                           name='name'
                           id='name'
                           value={user.name}
                           onChange={this.handleChange}
                    />

                    <label htmlFor='name' className={`formItem_label ${user.name ? 'small' : ''}`}>Name</label>
                </div>

                <div  className={`formItem phoneNumber`}>
                    <div className={`${this.state.formErrors.dialCode.length === 0 ? '' : 'error'} code`}>
                        <label htmlFor='dialCode' className={`formItem_label ${user.dialCode ? 'small' : ''}`}>Code</label>

                        <select placeholder='Code'
                                name='dialCode'
                                value={user.dialCode || ''}
                                onChange={this.handleChange}>
                                <option value=''></option>
                                
                                {
                                    this.state.countriesData.map((item, index) => {
                                        return <option key={index} value={item[1]}>{`+${item[1]}`}</option>
                                    })
                                }
                        </select>
                    </div>

                    <div className='tel'>
                        <input type='tel'
                               name='tel'
                               value={user.tel}
                               onChange={this.handleChange}
                        />

                        <label htmlFor='tel' className={`formItem_label ${user.tel ? 'small' : ''}`}>Phone number</label>
                    </div>
                </div>

                <div className={`formItem ${this.state.formErrors.email.length === 0 ? '' : 'error'}`}>
                    <input type='email'
                           name ='email'
                           value={user.email}
                           onChange={this.handleChange}
                    />

                    <label htmlFor='email' className={`formItem_label ${user.email ? 'small' : ''}`}>Email address</label>
                </div>

                <div className={`formItem ${this.state.formErrors.country.length === 0 ? '' : 'error'}`}>
                    <select name='country'
                            value={user.country || ''}
                            onChange={this.handleChange}>
                            <option value=''></option>
                            {
                                this.state.countriesData.map((item, index) => {
                                    return <option key={index} value={item[0]}>{item[0]}</option>
                                })
                            }
                    </select>

                    <label htmlFor='country' className={`formItem_label ${user.country ? 'small' : ''}`}>Country</label>
                </div>

                <div className={`formItem ${user.password.length > 5 && user.password.length < 128 ? 'match' : ''}`}>
                    <input type='password'
                           name='password'
                           value={user.password}
                           onChange={this.handleChange}
                    />

                    <label htmlFor='password' className={`formItem_label ${user.password ? 'small' : ''}`}>Password</label>
                </div>

                <div className={`formItem ${this.state.formErrors.password.length === 0 ? '' : 'error'} ${this.state.passwordValid ? 'match' : ''}`}>
                    <input type='password'
                           name='passwordConfirmation'
                           value={user.passwordConfirmation}
                           onChange={this.handleChange}
                    />
                    <label htmlFor='passwordConfirmation' className={`formItem_label ${user.passwordConfirmation ? 'small' : ''}`}>Password confirmation</label>
                    
                    {
                        user.password !== user.passwordConfirmation ?
                        <p className='passwordNotification'>Your passwords do not match</p> : 
                        ''
                    }
                </div>

                <div className='formItem mailing'>
                    <input type='checkbox'
                           name='isMailingChecked'
                           id='mailingStatus'
                           checked={user.isMailingChecked}
                           onChange={this.handleChange}
                    />

                    <label htmlFor='mailingStatus'>
                        Yes, I'd like to recieve the very occasional email with information on new services and discounts
                    </label>
                </div>

                <input type='submit'
                       className='registerButton'
                       value='Create an account'
                />

                <p className='log'>Already have a 24Slides account?
                    <a href='' target='_blank'>Click here</a> to log
                    in to your existing account and join a company team
                </p>
                
                <div className={`${this.state.status ? 'successNotification' : 'noCongr'}`}>
                    <div>
                        <img src='./components/images/shape.png' />
                        <p><span>Great!</span> your account has been successfully created.</p>
                    </div>

                    <button className='deleteNotificationButton'></button>
                </div>
            </form>
        )
   }
}
