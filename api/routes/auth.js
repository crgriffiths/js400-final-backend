const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const {decodeToken, createToken} = require('../helpers/auth')

router.get('/profile', async (req, res, next) => {
  try {
    const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
    const user = await User.findOne({ _id: payload.id }).select('-__v -password')
    const status = 200
    res.json({ status, user })
  } catch (e) {
    console.error(e)
    const error = new Error('You are not authorized to access this route.')
    error.status = 401
    next(error)
  }
})

router.post('/signup', async (req,res,next) => {
  const {email, password, firstName, lastName} = req.body
  const passwordHash = await bcrypt.hash(password, 10)
  const existingUser = await User.findOne({email})
  if (existingUser) {
    const error = new Error(`Email '${email}' is already registered.`)
    error.status = 400
    next(error)
  }
  const newUser = await User.create({email, password: passwordHash, firstName, lastName})
  const token = createToken(newUser._id, newUser.isAdmin)
  const message = 'You have successfully signed up'
  res.status(201).json({status,token, message})
})

router.post('/login', async (req,res,next) => {
  const {email, password} = req.body
  const user = await User.findOne({email})
  if (user) {
    await bcrypt.compare(password, user.password).then(function(response) {
      if (response) {
        const status = 200
        const response = 'Sign in successful'
        const token = createToken(user._id, user.isAdmin)
        res.status(status).json({status, response, token})
        return
      }
      const error = new Error('Username or password incorrect. Please check your credentials and try again.')
      error.status = 401
      next(error)
    })
  }
})

module.exports = router