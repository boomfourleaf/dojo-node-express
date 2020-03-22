const http = require('http'),
      path = require('path'),
      methods = require('methods'),
      express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      cors = require('cors'),
      parssport = require('passport'),
      errorHandler = require('errorhandler'),
      mongoose = require('mongoose')

const isProduction = process.env.NODE_ENV === 'prodiction'

// Create global app object
const app = express()

app.use(cors())

// Normal express configs defualt
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('method-override')())

// session setup
app.use(session({ secret: 'Hello World', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }))


if (!isProduction) {
  app.use(errorHandler())
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URL)
} else {
  // NO Database to connect
}

app.use(require('./routers'))

// catch 404 error
app.use(function (req, res, next) {
  let error = new Error('Not Found')
  error.status = 404
  next(error)
})

// Error handlers
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack)

    res.status(err.status || 500)

    res.json({ error: {
      message: err.message,
      error: err
    } })
  })
}

// Production error handlser
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({ error: {
    message: err.message,
    error: {}
  }})
})

// App running
const server = app.listen( process.env.PORT || 3030, function () {
  console.log(`Listining on port ${server.address().port}`)
})
