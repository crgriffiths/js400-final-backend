const { SECRET_KEY } = process.env
const { sign, verify } = require('jsonwebtoken')
const User = require('../models/user')

const decodeToken = (token) => verify(token, SECRET_KEY)

const createToken = (id, isAdmin) => {
  const payload = { id, isAdmin }
  const options = { expiresIn: '1 day' }
  return sign(payload, SECRET_KEY, options)
}

const checkOwner = async (req, _res, next) => {
  console.log(req.params)
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findById(payload.id)
  const assignment = user.assignments.id(req.params.aid)
  if (assignment) next()
  const error = new Error('You are not authorized for this action')
  error.status = 401
  next(error)
}
const isLoggedIn = (req, _res, next) => {
  if (!req.headers.authorization.split('Bearer ')[1]) {
    const error = new Error(`You are not logged in.`)
    error.status = 401
    return next(error)
  }
  try {
    decodeToken(req.headers.authorization.split('Bearer ')[1])
    next()
  } catch (e) {
    console.error(e)
    const error = new Error(`There is a problem with your credentials.`)
    error.status = 401
    next(error)
  }
}

const isAdmin = (token) => {
  const payload = decodeToken(token)
  if (payload.isAdmin) return true
  return false
}

const isCurrentUser = (req, _res, next) => {
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  if (payload.id === id) return next()

  const error = new Error(`You are not authorized to access this route.`)
  error.status = 401
  next(error)
}

module.exports = {decodeToken, createToken, checkOwner, isLoggedIn, isAdmin, isCurrentUser}