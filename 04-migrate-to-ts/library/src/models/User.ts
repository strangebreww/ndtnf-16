const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  email: {
    type: String
  }
})

module.exports = model('User', userSchema)
