const users = {};

function handleSocketConnection(socket, io) {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join', ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };
    socket.to(room).emit('notification', `${username} joined the room`);
  });

  socket.on('message', ({ room, message, sender }) => {
    io.to(room).emit('message', { sender, message, timestamp: new Date() });
  });

  socket.on('typing', ({ room, sender }) => {
    socket.to(room).emit('typing', sender);
  });

  socket.on('stopTyping', ({ room }) => {
    socket.to(room).emit('stopTyping');
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit('notification', `${user.username} left`);
      delete users[socket.id];
    }
  });
}

module.exports = { handleSocketConnection };
