const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  pointsEarned: {
    type: Number
  }
  pointsPossible: {
    type: Number
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = schema
