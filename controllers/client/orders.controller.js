const ordersService = require("../../services/client/orders.service");

module.exports = {

    // DANH SÁCH ĐƠN HÀNG
    orderList: async (req, res) => {
        try {
            if (!req.session.user) return res.redirect("/login");

            const userId = req.session.user._id;
            const orders = await ordersService.getOrderList(userId);

            res.render("client/pages/orders/index", {
                pageTitle: "Đơn hàng của tôi",
                orders
            });

        } catch (err) {
            res.render("client/pages/orders/index", {
                pageTitle: "Đơn hàng của tôi",
                orders: [],
                error: "Không thể tải danh sách đơn hàng!"
            });
        }
    },

    // CHI TIẾT ĐƠN HÀNG
    orderDetail: async (req, res) => {
        try {
            if (!req.session.user) return res.redirect("/login");

            const userId = req.session.user._id;
            const orderId = req.params.id;

            const order = await ordersService.getOrderDetail(userId, orderId);

            res.render("client/pages/orders/detail", {
                pageTitle: "Chi tiết đơn hàng",
                order
            });

        } catch (err) {
            res.redirect("/orders");
        }
    }

};
