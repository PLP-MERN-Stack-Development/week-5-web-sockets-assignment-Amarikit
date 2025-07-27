const express = require('express')
const Message = require('../models/Message')

const router = express.Router()

// Get all messages in a room
router.get('/:room', async (req, res) => {
  const messages = await Message.find({ room: req.params.room }).populate('sender', 'name')
  res.json(messages)
})

// Post a message
router.post('/', async (req, res) => {
  const message = new Message(req.body)
  await message.save()
  res.status(201).json(message)
})

module.exports = router
