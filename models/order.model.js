const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product" },
            title: String,
            price: Number,
            thumbnail: String,
            quantity: Number
        }
    ],
    total: Number,

    shippingInfo: {
        name: String,
        phone: String,
        address: String
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
        default: "pending"
    },

}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
