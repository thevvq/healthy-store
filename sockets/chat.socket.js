module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('[socket] connected:', socket.id);

    // Join room của user
    socket.on('join-user', (userID) => {
      socket.join(userID); // room = userID
      console.log(`User joined room ${userID}`);
    });

    // Join admin_room
    socket.on('join-admin', () => {
      socket.join('admin_room');
      console.log(`Admin joined admin_room`);
    });

    // Khi user gửi
    socket.on('user-send-message', async (data) => {
      const saved = await require('../controllers/chat.controller')
        .saveMessage({ userID: data.userID, content: data.message });

      // gửi tới admin
      io.to('admin_room').emit('admin-receive-message', saved);
      // gửi lại cho chính user
      socket.emit('user-receive-message', saved);
    });

    // Khi admin gửi
    socket.on('admin-send-message', async (data) => {
      const saved = await require('../controllers/chat.controller')
        .saveMessage({ userID: data.userID, content: data.message });

      // gửi cho user
      io.to(data.userID).emit('user-receive-message', saved);
      // gửi cho toàn bộ admin (để đồng bộ nếu nhiều admin)
      io.to('admin_room').emit('admin-receive-message', saved);
    });
  });
};
