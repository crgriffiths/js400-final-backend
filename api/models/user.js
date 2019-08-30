const mongoose = require('mongoose')
const Assignment = require('./assignment')

const schema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  gradeTotal: {
    pointsEarned: Number,
    pointsPossible: Number
  },
  assignments: {
    type: [Assignment],
    default: undefined
  }
  
}, { _id: true, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = mongoose.model('User', schema)
