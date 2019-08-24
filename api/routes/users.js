const router = require('express').Router()
const {isAdmin, isCurrentUser} = require('../helpers/auth')
const User = require('../models/user')

// Return list of all students
// Admins should also see grades and have a filter by grades
router.get('/', isAdmin, isCurrentUser, async (req, res, next) => {
  const status = 200
  const response = User.find()
  res.json({status, response})
})

module.exports = router