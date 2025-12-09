const Order = require("../../models/order.model");

function mapStatus(status) {
    switch (status) {
        case "pending": return "Đang xử lý";
        case "confirmed": return "Đã duyệt";
        case "shipping": return "Đang giao";
        case "completed": return "Hoàn tất";
        case "cancelled": return "Đã hủy";
        default: return "Không xác định";
    }
}

module.exports = {

    // ======================================================
    // ADMIN: DANH SÁCH ĐƠN HÀNG (ẨN ĐƠN ĐÃ HỦY)
    // ======================================================
    index: async (req, res) => {
        try {
            // Admin KHÔNG được thấy đơn đã hủy
            let orders = await Order.find({ status: { $ne: "cancelled" } })
                .sort({ createdAt: -1 });

            orders = orders.map(o => ({
                ...o.toObject(),
                statusText: mapStatus(o.status)
            }));

            res.render("admin/pages/orders/index", {
                pageTitle: "Quản lý đơn hàng",
                orders
            });

        } catch (err) {
            console.error("Admin Order List Error:", err);
            res.render("admin/pages/orders/index", {
                pageTitle: "Quản lý đơn hàng",
                orders: [],
                error: "Không thể tải danh sách đơn!"
            });
        }
    },

    // ======================================================
    // ADMIN: CHI TIẾT ĐƠN HÀNG (KHÔNG XEM ĐƠN ĐÃ HỦY)
    // ======================================================
    detail: async (req, res) => {
        try {
            const orderDoc = await Order.findById(req.params.id);

            // Nếu khách đã hủy → admin không xem được
            if (!orderDoc || orderDoc.status === "cancelled") {
                return res.send("Đơn hàng không tồn tại hoặc đã bị khách hủy!");
            }

            const order = {
                ...orderDoc.toObject(),
                statusText: mapStatus(orderDoc.status)
            };

            res.render("admin/pages/orders/detail", {
                pageTitle: "Chi tiết đơn hàng",
                order
            });

        } catch (err) {
            console.error("Admin Order Detail Error:", err);
            res.send("Lỗi khi tải chi tiết đơn hàng!");
        }
    },

    // ======================================================
    // ADMIN: CẬP NHẬT TRẠNG THÁI (KHÔNG ĐƯỢC SET cancelled)
    // ======================================================
    updateStatus: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { status } = req.body;

            // ❌ NGĂN ADMIN tự hủy đơn
            if (status === "cancelled") {
                return res.send("Admin không có quyền hủy đơn hàng!");
            }

            await Order.findByIdAndUpdate(orderId, { status });

            res.redirect(`/admin/orders/${orderId}`);

        } catch (err) {
            console.error("Update Status Error:", err);
            res.send("Lỗi cập nhật trạng thái đơn hàng!");
        }
    }
};
