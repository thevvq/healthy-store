const chatSocket = require("./chat.socket");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        chatSocket(io, socket);
    });
};
