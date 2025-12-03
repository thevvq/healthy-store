const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["client", "admin"],
            default: "client"
        },
        avatar: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            enum: ["male", "female", "other", ""],
            default: ""
        },
        birthday: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model("User", userSchema, "users");
