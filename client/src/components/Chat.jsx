import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import Picker from 'emoji-picker-react'

export default function Chat({ socket, username }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const messageEndRef = useRef(null)

  useEffect(() => {
    socket.on('chatMessage', (data) => {
      setMessages((prev) => [...prev, data])
    })

    socket.on('typing', (data) => setTypingStatus(data))
    socket.on('stopTyping', () => setTypingStatus(''))

    return () => {
      socket.off('chatMessage')
      socket.off('typing')
      socket.off('stopTyping')
    }
  }, [socket])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!message.trim()) return
    const data = {
      user: username,
      text: message,
      time: format(new Date(), 'HH:mm')
    }

    socket.emit('chatMessage', data)
    socket.emit('stopTyping')
    setMessage('')
  }

  const handleTyping = () => {
    socket.emit('typing', `${username} is typing...`)
    setTimeout(() => {
      socket.emit('stopTyping')
    }, 1000)
  }

  const getInitials = (name) => name?.charAt(0).toUpperCase()

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl h-[90vh] flex flex-col">
      {}
      <div className="bg-blue-600 text-white p-4 rounded-t flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat Room</h2>
        <span className="text-sm">You: {username}</span>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.user === username ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`max-w-xs rounded-lg p-3 shadow-sm ${
              msg.user === username
                ? 'bg-blue-100 text-right'
                : 'bg-white border text-left'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {getInitials(msg.user)}
                </div>
                <p className="font-medium text-sm">{msg.user}</p>
              </div>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {}
      <p className="text-sm text-gray-500 px-4 py-1">{typingStatus}</p>

      {}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-2xl"
            title="Add emoji"
          >
            😊
          </button>
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </div>
        {showEmojiPicker && (
          <div className="mt-2">
            <Picker
              onEmojiClick={(e, emojiObject) =>
                setMessage((prev) => prev + emojiObject.emoji)
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
