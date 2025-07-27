import { useState } from 'react'
import io from 'socket.io-client'
import Chat from './components/Chat'

const socket = io('http://localhost:5001') 

export default function App() {
  const [username, setUsername] = useState('')
  const [hasJoined, setHasJoined] = useState(false)

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit('join', username)
      setHasJoined(true)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      {!hasJoined ? (
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Join the Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            className="border p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={handleJoin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition duration-300"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} />
      )}
    </div>
  )
}
