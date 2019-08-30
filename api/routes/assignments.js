const router = require('express').Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const assignmentSchema = require('../models/assignment')
const Assignment = mongoose.model('Assignment', assignmentSchema) 
const { decodeToken, createToken, checkOwner, isLoggedIn, isAdmin, isCurrentUser, requiresAdmin} = require('../helpers/auth')


// (Admin Only) Return a list of all graded assingments by all students
router.get('/graded', async (req,res,next) => {
  const status = 200
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const users = await User.find({"assignments.grade.pointsEarned":{$exists:true}})
  res.status(status).json(users)
})

// (Admin Only) Return a list of all ungraded assignments by all students
router.get('/ungraded', async (req, res, next) => {
  const status = 200
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const users = await User.find({"assignments.grade.pointsEarned":{$exists:false}})
  res.status(status).json(users)
})

// Return list of assigments for the logged in student user
router.get('/', isLoggedIn, async (req, res, next) => {
  const status = 200
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const response = await User.findOne({_id: payload.id}).select('assignments')
  res.json({status, response})
})
router.get('/:aid', isLoggedIn, async (req, res, next) => {
  const status = 200
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findOne({_id: payload.id})
  const assignment = user.assignments.id(req.params.aid)
  res.json({status, respnseassignment})
})

// Create a new assignment for the logged in student user
router.post('/', async (req, res, next) => {
  const status = 201
  const assignment = {title:req.body.title,link:req.body.link,description:req.body.description}
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findOne({_id: payload.id})
  user.assignments.push(assignment)
  await user.save()
  const newAssignment = user.assignments[user.assignments.length - 1]
  res.status(status).json({status, response: newAssignment})
})

/**
 * TODO: Fix DELETE path
 */

// Create a new assignment for the logged in student user
router.delete('/:aid', isLoggedIn, checkOwner, async (req, res, next) => {
  const status = 200
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findOne({_id: payload.id})
  const assignment = user.assignments.id(req.params.aid)
  assignment.remove()
  await user.save()
  res.json({status, message: `Assignment with id:${req.params.aid} removed`})
})

// Edit an assignment by Assignment ID (only edit title,link,desc)
router.patch('/:aid', isLoggedIn, checkOwner, async (req, res, next) => {
  const status = 200
  const update = {title: req.body.title, link: req.body.link, description: req.body.description}
  const payload = decodeToken(req.headers.authorization.split('Bearer ')[1])
  const user = await User.findOne({_id: payload.id})
  const assignment = user.assignments.id(req.params.aid)
  assignment.set(update)
  await user.save()
  console.log(assignment)
  res.status(status).json(assignment)
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



module.exports = router
