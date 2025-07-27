require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const connectDB = require('./config/db')
const Message = require('./models/Message')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
connectDB()

io.on('connection', async (socket) => {
  console.log('New user connected:', socket.id)

  
  const messages = await Message.find().sort({ createdAt: 1 }).limit(100)
  socket.emit('chatHistory', messages)

  
  socket.on('join', (username) => {
    socket.username = username
    console.log(`👤 ${username} joined`)
  })

  
  socket.on('chatMessage', async (data) => {
    const newMessage = await Message.create({
      username: data.username,
      text: data.text,
      time: data.time
    })
    io.emit('chatMessage', newMessage)
  })

  
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username)
  })

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping')
  })

  socket.on('disconnect', () => {
    console.log(`${socket.username || 'User'} disconnected`)
  })
})

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
})

