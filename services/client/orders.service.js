const Order = require("../../models/order.model");

module.exports = {
    getOrderList: async (userId) => {
        return await Order.find({ userId }).sort({ createdAt: -1 });
    },

    getOrderDetail: async (userId, orderId) => {
        const order = await Order.findOne({
            _id: orderId,
            userId
        });

        if (!order) throw new Error("Không tìm thấy đơn hàng");

        return order;
    }
};
