    const express = require("express");
    const router = express.Router();
    const checkoutController = require("../../controllers/client/checkout.controller");

    // CHỈ render checkout khi POST từ giỏ hàng
    router.post("/", checkoutController.renderCheckout);

    // Đặt hàng
    router.post("/place-order", checkoutController.placeOrder);

    module.exports = router;
