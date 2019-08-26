const jsonServer = require('json-server')
const { check, validationResult } = require('express-validator/check')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const countries = require('./countries')

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(jsonServer.bodyParser)

// Add custom routes before JSON Server router
server.get('/countries', (req, res) => {
  res.json(countries)
})
server.post('/register', [
  check('name')
    .isLength({min: 3, max: 30}).withMessage('Name must be more than 3 characters and less than 30')
    .matches('^[a-z ,.\'-]+$', 'i'),
  check('dialCode').matches('^\\+?\\d{1,4}$'),
  check('email').isEmail(),
  check('country').isIn(['UK', 'US']),
  check('password')
    .isLength({min: 5, max: 128}).withMessage('Password must be more than 5 characters and less than 128')
    .matches('^[^\s]+$'),
  check('passwordConfirmation')
    .custom((value,{req, loc, path}) => {
      if (value !== req.body.passwordConfirmation) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
], (req, res) => {
  console.log(req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  res.json({ status: 'success' })
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.listen(3002, () => {
  console.log('JSON Server is running')
})