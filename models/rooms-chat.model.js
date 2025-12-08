const mongoose = require('mongoose')

const roomChatSchema = new mongoose.Schema(
    {
        title: String,
        avatar: String,
        typeRoom: String,
        users: [
            {user_id: String}
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deleted_at: Date
    },
    {
        timestamps: true
    }
)

const RoomChat = mongoose.model('RoomChat', roomChatSchema, 'rooms-chat')

module.exports = RoomChat
