const { validationResult } = require("express-validator");
const checkoutService = require("../../services/client/checkout.service");

module.exports = {

    /* ======================================================
       RENDER TRANG CHECKOUT
       (GIỮ NGUYÊN LUỒNG POST TỪ CART)
    ====================================================== */
    renderCheckout: async (req, res) => {
        try {
            // Chưa đăng nhập → chuyển login
            if (!req.session.user) {
                return res.redirect("/login");
            }

            let selectedItems = [];

            // Lấy selectedItems từ POST giỏ hàng
            if (req.body.selectedItems) {
                try {
                    selectedItems = JSON.parse(req.body.selectedItems);
                } catch (err) {
                    req.flash("error", "Dữ liệu sản phẩm không hợp lệ!");
                    return res.redirect("/cart");
                }
            }

            // Không có sản phẩm được chọn
            if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
                req.flash("error", "Vui lòng chọn sản phẩm để thanh toán!");
                return res.redirect("/cart");
            }

            // Lấy danh sách item + tổng tiền
            const data = await checkoutService.getSelectedItems(req, selectedItems);

            return res.render("client/pages/checkout/index", {
                pageTitle: "Thanh toán",
                items: data.items,
                total: data.total,

                // ⭐ GỬI XUỐNG VIEW DƯỚI DẠNG CHUỖI JSON
                selectedItems: JSON.stringify(selectedItems),

                // ⭐ LẤY THÔNG TIN TỪ PROFILE (KHÔNG ẢNH HƯỞNG CŨ)
                profile: {
                    fullName: req.session.user.fullName || "",
                    phone: req.session.user.phone || "",
                    address: req.session.user.address || ""
                }
            });

        } catch (err) {
            console.error("Checkout Render Error:", err);
            req.flash("error", err.message || "Không thể tải trang thanh toán!");
            return res.redirect("/cart");
        }
    },


    /* ======================================================
       PLACE ORDER – XỬ LÝ ĐẶT HÀNG
       (GIỮ NGUYÊN API JSON CHO checkout.js)
    ====================================================== */
    placeOrder: async (req, res) => {

        // Bắt lỗi validate (số điện thoại, địa chỉ, ...)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        // Chưa đăng nhập
        if (!req.session.user) {
            return res.json({
                success: false,
                message: "Bạn cần đăng nhập để đặt hàng!"
            });
        }

        let ids = [];

        // Parse selectedItems
        try {
            ids = JSON.parse(req.body.selectedItems);
        } catch (err) {
            return res.json({
                success: false,
                message: "Dữ liệu sản phẩm không hợp lệ!"
            });
        }

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.json({
                success: false,
                message: "Không có sản phẩm nào được chọn!"
            });
        }

        try {
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
