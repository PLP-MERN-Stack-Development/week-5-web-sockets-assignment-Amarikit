const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  username: String,
  text: String,
  time: String
}, { timestamps: true })

module.exports = mongoose.model('Message', MessageSchema)
