const { NODE_ENV, PORT } = process.env
const express = require('express')
const cors = require('cors')
const app = express()
const bodyparser = require('body-parser')

// DB Connect
require('./db/dbconnect')()


// Application-level Middleware
if (NODE_ENV === 'development') app.use(require('morgan')('dev'))

app.use(bodyparser.json())

// Use cors
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Routes
app.use('/api/assignments', require('./api/routes/assignments'))
app.use('/api/students', require('./api/routes/users'))
app.use('/api/auth', require('./api/routes/auth'))

// Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Could not ${req.method} ${req.path}`)
  error.status = 404
  next(error)
})

// Error Handler
app.use((err, req, res, next) => {
  if (NODE_ENV === 'development') console.error(err)
  const { message, status } = err
  res.status(status).json({ status, message })
})

// Open Connection
const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)