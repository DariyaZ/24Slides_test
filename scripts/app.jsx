import React, { Component } from 'react'
import { hot } from 'react-hot-loader';
import Form from '../components/index';

class App extends Component {
  render() {
    return (
      <div className="app">      
        <Form />
      </div>
    )
  }
}

export default hot(module)(App);