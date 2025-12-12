const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

/* ======================================================
   LẤY DANH SÁCH SẢN PHẨM ĐƯỢC CHỌN ĐỂ THANH TOÁN
====================================================== */
module.exports.getSelectedItems = async (req, selectedItems) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            throw new Error("Bạn chưa đăng nhập!");
        }

        if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
            throw new Error("Không có sản phẩm nào được chọn!");
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error("Giỏ hàng đang trống!");
        }

        // Lọc các item được chọn
        const selected = cart.items.filter(item =>
            selectedItems.includes(item.productId.toString())
        );

        if (selected.length === 0) {
            throw new Error("Không có sản phẩm nào được chọn!");
        }

        const total = selected.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        return {
            items: selected,
            total
        };

    } catch (err) {
        console.error("Get Selected Items Error:", err);
        throw new Error(err.message || "Lỗi khi lấy danh sách sản phẩm để thanh toán!");
    }
};



/* ======================================================
   TẠO ĐƠN HÀNG – KIỂM TRA TỒN KHO – TRỪ KHO – XÓA GIỎ
====================================================== */
module.exports.createOrder = async (req, selectedItems) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            throw new Error("Bạn chưa đăng nhập!");
        }

        if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
            throw new Error("Không có sản phẩm nào được chọn để đặt hàng!");
        }

        const { name, phone, address } = req.body;

        // Kiểm tra thông tin giao hàng
        if (!name || !phone || !address) {
            throw new Error("Vui lòng nhập đầy đủ thông tin giao hàng!");
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error("Giỏ hàng rỗng, không thể đặt hàng!");
        }

        // Lọc các item được chọn
        const selected = cart.items.filter(item =>
            selectedItems.includes(item.productId.toString())
        );

        if (selected.length === 0) {
            throw new Error("Không có sản phẩm nào được chọn để đặt hàng!");
        }

        /* ======================================================
           KIỂM TRA TỒN KHO
        ====================================================== */
        for (const item of selected) {
            const product = await Product.findById(item.productId);

            if (!product) {
                throw new Error("Sản phẩm không tồn tại!");
            }

            if (product.stock < item.quantity) {
                throw new Error(
                    `Sản phẩm "${product.title}" chỉ còn ${product.stock} cái trong kho!`
                );
            }
        }

        /* ======================================================
           TRỪ TỒN KHO
        ====================================================== */
        for (const item of selected) {
            const product = await Product.findById(item.productId);
            product.stock -= item.quantity;
            await product.save();
        }

        /* ======================================================
           TẠO ĐƠN HÀNG
        ====================================================== */
        const totalPrice = selected.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            userId,
            items: selected,
            total: totalPrice,
            shippingInfo: {
                name,
                phone,
                address
            },
            status: "pending",
            createdAt: new Date()
        });

        /* ======================================================
           XÓA ITEM ĐÃ ĐẶT KHỎI GIỎ HÀNG
        ====================================================== */
        cart.items = cart.items.filter(
            item => !selectedItems.includes(item.productId.toString())
        );

        await cart.save();

        return order;

    } catch (err) {
        console.error("Create Order Error:", err);
        throw new Error(err.message || "Không thể tạo đơn hàng!");
    }
};
