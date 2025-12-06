const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

module.exports = {
    // LẤY GIỎ HÀNG ĐỂ HIỂN THỊ CHECKOUT
    getCheckoutData: async (userId) => {
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            throw new Error("Giỏ hàng trống!");
        }

        const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

        return { cart: cart.items, total };
    },

    // XỬ LÝ ĐẶT HÀNG
    placeOrder: async (userId, shippingInfo) => {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            throw new Error("Giỏ hàng đang trống!");
        }

        // TRỪ TỒN KHO
        for (let item of cart.items) {
            const product = await Product.findById(item.productId);

            if (!product) throw new Error("Sản phẩm không tồn tại!");
            if (product.stock < item.quantity) {
                throw new Error(`Sản phẩm '${product.title}' không đủ hàng!`);
            }

            product.stock -= item.quantity;
            await product.save();
        }

        // TẠO ĐƠN HÀNG
        const order = await Order.create({
            userId,
            items: cart.items,
            totalPrice: cart.items.reduce((s, i) => s + i.price * i.quantity, 0),
            shippingInfo,
            status: "pending"
        });

        // XÓA GIỎ HÀNG
        await Cart.deleteOne({ userId });

        return order;
    }
};
