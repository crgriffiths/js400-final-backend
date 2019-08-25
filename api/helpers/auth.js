const { SECRET_KEY } = process.env
const { sign, verify } = require('jsonwebtoken')

const decodeToken = (token) => verify(token, SECRET_KEY)

const createToken = (id, isAdmin) => {
  const payload = { id, isAdmin }
  const options = { expiresIn: '1 day' }
  return sign(payload, SECRET_KEY, options)
}

const isAdmin = (userId) => {
}
const isCurrentUser = (userId) => {
}

module.exports = {decodeToken, createToken, isAdmin, isCurrentUser}