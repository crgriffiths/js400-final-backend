const router = require('express').Router()
const User = require('../models/user')
const { decodeToken, createToken, checkOwner, isLoggedIn, isAdmin, isCurrentUser} = require('../helpers/auth')

// Return list of assigments for the logged in student user
router.get('/', isLoggedIn, async (req, res, next) => {
  const status = 200
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const response = await User.findOne({_id: payload.id}).select('assignments')
  res.json({status, response})
})

// Create a new assignment for the logged in student user
router.post('/', async (req, res, next) => {
  const status = 201
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findOne({_id: payload.id})
  const assignment = {...req.body}
  user.assignments.push(assignment)
  await user.save()
  const newAssignment = user.assignments[user.assignments.length - 1]
  res.json({status, response: newAssignment})
})

// Edit an assignment by Assignment ID (only edit title,link,desc)
router.patch('/:aid', isLoggedIn, checkOwner, async (req, res, next) => {
  const status = 200
  const user = await User.findById(payload.id)
  const assignment = user.findByIdAndUpdate(req.params.aid, req.body)
  //assignment.set(req.body)
  //await user.save()
  //const response = user.assignments.id(req.params.aid)
  res.json(status,assignment)
})

// (Admin Only) Return a list of all ungraded assignments by all students
router.get('/ungraded', (req, res, next) => {})

// (Admin Only) Assign a grade to an assignment. Accepts to params: 1) Score, 2) Total Score Possible
// This must also aggregate assignments for the user and update their total score. 
// Use the .parent() function
router.patch('/:aid/grade', (req, res, next) => {})

// (Admin Only) Return a list of all graded assingments by all students
router.get('/graded', (req,res,next) => {})

module.exports = router

