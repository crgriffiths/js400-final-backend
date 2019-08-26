const router = require('express').Router()
const {decodeToken, createToken, isLoggedIn, isAdmin, isCurrentUser} = require('../helpers/auth')
const User = require('../models/user')

// Return list of all students
// Admins should also see grades and have a filter by grades
router.get('/', isLoggedIn, async (req, res, next) => {
  const status = 200
  const adminStatus = isAdmin(req.headers.authorization.split('Bearer ')[1])
  if (adminStatus) {
    const response = await User.find({isAdmin: false}).select('-__v -password -assignments')
    res.json({status, response})
    return
  }
  const response = await User.find({isAdmin: false}).select('-__v -password -assignments -gradeTotal')
  res.json({status, response})
})

module.exports = router