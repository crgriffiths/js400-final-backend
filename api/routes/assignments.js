const router = require('express').Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const assignmentSchema = require('../models/assignment')
const Assignment = mongoose.model('Assignment', assignmentSchema) 
const { decodeToken, createToken, checkOwner, isLoggedIn, isAdmin, isCurrentUser, requiresAdmin} = require('../helpers/auth')

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
  //const {title, link, description} = req.body
  //console.log(title,link,description)
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findOne({_id: payload.id})
  user.assignments.push({title:req.body.title,link:req.body.link,description:req.body.description})
  await user.save()
  const newAssignment = user.assignments[user.assignments.length - 1]
  res.json({status, response: newAssignment})
})

/**
 * TODO: Fix DELETE path
 */

// Create a new assignment for the logged in student user
router.delete('/:aid', async (req, res, next) => {
  const status = 201
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findOne({_id: payload.id})
  //const assignment = {...req.body}
  //console.log(assignment)
  //user.assignments.push(assignment)
  await user.save()
  //const newAssignment = user.assignments[user.assignments.length - 1]
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
router.get('/ungraded', requiresAdmin, async (req, res, next) => {
  const status = 200
  const response = Assignment.find({grade:{pointsEarned:{$exists: false}}})
  res.json({status,response})
})

// (Admin Only) Assign a grade to an assignment. Accepts to params: 1) Score, 2) Total Score Possible
// This must also aggregate assignments for the user and update their total score. 
// Use the .parent() function
router.patch('/:aid/grade', requiresAdmin, async (req, res, next) => {
  const status = 200
  const assigment = Assignment.findOneAndUpdate({_id: req.params.aid}, req.body, {
    new: true
  })
  res.json({status, assigment})
})

// (Admin Only) Return a list of all graded assingments by all students
router.get('/graded', requiresAdmin, async (req,res,next) => {
  const status = 200
  const response = Assignment.find({grade:{pointsEarned:{$exists: true}}})
  res.json({status,response})
})

module.exports = router
