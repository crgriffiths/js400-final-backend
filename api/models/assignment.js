const mongoose = require('mongoose')
//const Grade = require('./grade')

const schema = new mongoose.Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  description: {
    type: String
  },
  grade: {
    pointsEarned: {
      type: Number
    },
    pointsPossible: {
      type: Number
    }
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = schema