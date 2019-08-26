const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const config = require('../nodemon.json')
const User = require('../api/models/user')

const reset = async () => {
  mongoose.connect(config.env.MONGO_DB_CONNECTION, { useNewUrlParser: true })
  // Careful with .remove() -- it sends a command directly to the database
  // and skips any mongoose validations
  await User.deleteMany() // Deletes all records
  return User.create([
    {
      firstName: 'Student',
      lastName: 'User',
      email: 'student@email.com',
      password: bcrypt.hashSync('password', 10),
      isAdmin: false,
      gradeTotal: {
        pointsEarned: 167,
        pointsPossible: 200
      },
      assignments: [
        {
          title: 'HTML & CSS Final Project',
          link: 'https://github.com',
          description: 'My final project for the HTML & CSS course',
          grade: {
            pointsEarned: 78,
            pointsPossible: 100
          }
        },
        {
          title: 'Flexbox Exercise',
          link: 'https://github.com',
          description: 'An exercise for working with Flexbox',
          grade: {
            pointsEarned: 89,
            pointsPossible: 100
          }
        }
      ]
    },
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@email.com',
      password: bcrypt.hashSync('password', 10),
      isAdmin: true
    }
  ])
}

reset().catch(console.error).then((response) => {
  console.log(`Seeds successful! ${response.length} records created.`)
  return mongoose.disconnect()
})
