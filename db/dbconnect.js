const { MONGO_DB_CONNECTION } = process.env
const mongoose = require('mongoose')

const dbconnect = async () => {  
  try {
    if (!MONGO_DB_CONNECTION) {
      throw 'No valid Mongo DB Connection string found'
    }
    mongoose.connect(MONGO_DB_CONNECTION, {useNewUrlParser: true, useFindAndModify: true})
    console.log('Mongo db connection established...')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = dbconnect