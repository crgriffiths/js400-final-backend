const router = require('express').Router()

// Return list of assigments for the logged in student user
router.get('/', (req, res, next) => {})

// Create a new assignment for the logged in student user
router.post('/', (req, res, next) => {})

// Edit an assignment by Assignment ID (only edit title,link,desc)
router.patch('/:aid', (req, res, next) => {})

// (Admin Only) Return a list of all ungraded assignments by all students
router.get('/ungraded', (req, res, next) => {})

// (Admin Only) Assign a grade to an assignment. Accepts to params: 1) Score, 2) Total Score Possible
router.patch('/:aid/grade')

// (Admin Only) Return a list of all graded assingments by all students
router.get('/graded', (req,res,next) => {})

