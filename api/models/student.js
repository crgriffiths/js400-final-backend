const mongoose = require('mongoose')
const Assignment = require('./assignment')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  assignments: [Assignment]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = schema
