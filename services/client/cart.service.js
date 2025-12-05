const Product = require("../../models/product.model");

/* ======================================================
   HÀM TÍNH GIÁ SAU GIẢM
====================================================== */
function calculateNewPrice(product) {
    const discount = product.discountPercentage || 0;
    return product.price - (product.price * discount / 100);
}

/* ======================================================
   LẤY GIỎ HÀNG TỪ SESSION
====================================================== */
module.exports.getCart = async (req) => {
    const cart = req.session.cart || {};
    let total = 0;

    for (let id in cart) {
        total += cart[id].price * cart[id].quantity;
    }

    return {
        cart,
        total
    };
};

/* ======================================================
   THÊM SẢN PHẨM VÀO GIỎ HÀNG
====================================================== */
module.exports.addToCart = async (req, productId, quantity) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Sản phẩm không tồn tại");
    }

    const qty = parseInt(quantity);
    if (qty <= 0) throw new Error("Số lượng không hợp lệ");
    if (qty > product.stock) throw new Error("Số lượng vượt quá tồn kho");

    const newPrice = calculateNewPrice(product);

    if (!req.session.cart) req.session.cart = {};
    const cart = req.session.cart;

    // Nếu đã có trong giỏ → tăng số lượng
    if (cart[productId]) {
        let totalQty = cart[productId].quantity + qty;

        if (totalQty > product.stock) {
            throw new Error("Không đủ số lượng trong kho");
        }

        cart[productId].quantity = totalQty;

    } else {
        // Nếu chưa có → thêm mới
        cart[productId] = {
            id: productId,
            title: product.title,
            price: newPrice, // ⭐ luôn đảm bảo có giá → không NaN
            thumbnail: product.thumbnail || "/images/default.png",
            quantity: qty,
            maxStock: product.stock
        };
    }

    req.session.cart = cart;
    return true;
};


/* ======================================================
   CẬP NHẬT SỐ LƯỢNG
====================================================== */
module.exports.updateQuantity = async (req, productId, quantity) => {
    const cart = req.session.cart || {};

    if (!cart[productId]) {
        throw new Error("Sản phẩm không có trong giỏ");
    }

    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");

    const qty = parseInt(quantity);

    // Nếu = 0 → xóa khỏi giỏ
    if (qty <= 0) {
        delete cart[productId];
        req.session.cart = cart;
        return true;
    }

    if (qty > product.stock) throw new Error("Vượt quá tồn kho");

    cart[productId].quantity = qty;
    req.session.cart = cart;

    return true;
};


/* ======================================================
   XÓA 1 SẢN PHẨM
====================================================== */
module.exports.removeItem = async (req, productId) => {
    const cart = req.session.cart || {};

    if (cart[productId]) {
        delete cart[productId];
    }

    req.session.cart = cart;
    return true;
};


/* ======================================================
   XOÁ TẤT CẢ GIỎ HÀNG
====================================================== */
module.exports.clearCart = async (req) => {
    req.session.cart = {};
    return true;
};
