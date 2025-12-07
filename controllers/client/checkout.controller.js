const checkoutService = require("../../services/client/checkout.service");

module.exports = {

    // ==========================================
    // HIỂN THỊ TRANG CHECKOUT
    // ==========================================
    renderCheckout: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect("/login");
            }

            let selectedItems = [];

            // Lấy dữ liệu POST từ giỏ hàng
            if (req.body.selectedItems) {
                try {
                    selectedItems = JSON.parse(req.body.selectedItems);
                } catch (err) {
                    req.flash("error", "Dữ liệu sản phẩm không hợp lệ!");
                    return res.redirect("/cart");
                }
            }

            if (!selectedItems || selectedItems.length === 0) {
                req.flash("error", "Vui lòng chọn sản phẩm để thanh toán!");
                return res.redirect("/cart");
            }

            const data = await checkoutService.getSelectedItems(req, selectedItems);

            // ⭐ CHỖ QUAN TRỌNG: stringify ở đây, không để Pug tự xử lý mảng
            const selectedItemsJson = JSON.stringify(selectedItems);

            return res.render("client/pages/checkout/index", {
                pageTitle: "Thanh toán",
                items: data.items,
                total: data.total,
                selectedItems: selectedItemsJson   // GỬI XUỐNG DƯỚI DẠNG CHUỖI JSON
            });

        } catch (err) {
            console.error("Checkout Render Error:", err);
            req.flash("error", "Không thể tải trang thanh toán!");
            return res.redirect("/cart");
        }
    },


    // ==========================================
    // XỬ LÝ ĐẶT HÀNG
    // ==========================================
    placeOrder: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.json({ success: false, message: "Bạn cần đăng nhập!" });
            }

            const { name, phone, address, selectedItems } = req.body;

            if (!name || !phone || !address) {
                return res.json({ success: false, message: "Vui lòng nhập đủ thông tin!" });
            }

            if (!selectedItems) {
                return res.json({ success: false, message: "Không có sản phẩm nào được chọn!" });
            }

            let ids = [];
            try {
                ids = JSON.parse(selectedItems);
            } catch (err) {
                return res.json({ success: false, message: "Dữ liệu sản phẩm không hợp lệ!" });
            }

            if (ids.length === 0) {
                return res.json({ success: false, message: "Không có sản phẩm nào được chọn!" });
            }

            const order = await checkoutService.createOrder(req, ids);

            return res.json({
                success: true,
                message: "Đặt hàng thành công!",
                orderId: order._id
            });

        } catch (err) {
            console.error("Place Order Error:", err);
            return res.json({
                success: false,
                message: err.message || "Lỗi hệ thống khi đặt hàng!"
            });
        }
    }
};
