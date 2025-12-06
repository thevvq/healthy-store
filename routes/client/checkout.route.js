const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/client/checkout.controller");

router.get("/", checkoutController.renderCheckout);
router.post("/", checkoutController.placeOrder);

module.exports = router;
