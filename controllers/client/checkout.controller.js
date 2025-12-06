const checkoutService = require("../../services/client/checkout.service");

module.exports = {
    // HIỂN THỊ TRANG CHECKOUT
    renderCheckout: async (req, res) => {
        try {
            if (!req.session.user) return res.redirect("/login");

            const userId = req.session.user._id;
            const data = await checkoutService.getCheckoutData(userId);

            res.render("client/pages/checkout/index", {
                pageTitle: "Thanh toán",
                cart: data.cart,
                total: data.total
            });

        } catch (err) {
            res.redirect("/cart");
        }
    },

    // XỬ LÝ ĐẶT HÀNG
    placeOrder: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.json({ success: false, message: "Bạn cần đăng nhập!" });
            }

            const userId = req.session.user._id;
            const { name, phone, address } = req.body;

            const order = await checkoutService.placeOrder(userId, {
                name, phone, address
            });

            return res.json({
                success: true,
                message: "Đặt hàng thành công!",
                orderId: order._id
            });

        } catch (err) {
            return res.json({
                success: false,
                message: err.message || "Lỗi đặt hàng!"
            });
        }
    }
};
