const Chat = require('../models/chat.model');
const RoomChat = require('../models/rooms-chat.model');
const User = require('../models/uer.model');

module.exports = {
    getChatsByRoom: async (roomID) => {
        return await Chat.find({ room_id: roomID, deleted: false })
                         .sort({ createdAt: 1 })
                         .lean();
    },

    saveMessage: async ({ userID, roomID, content, images = [] }) => {
        const chat = new Chat({
            user_id: userID,
            room_id: roomID,
            content,
            images
        });
        await chat.save();
        return chat;
    },

    createRoomIfNotExist: async (userIDs) => {
        let room = await RoomChat.findOne({ 'users.user_id': { $all: userIDs }, deleted: false });
        if (!room) {
            room = new RoomChat({ users: userIDs.map(id => ({ user_id: id })) });
            await room.save();
        }
        return room;
    }
};
