const express = require("express");
const router = express.Router();
const ordersCtrl = require("../../controllers/client/orders.controller");

// Danh sách đơn hàng
router.get("/", ordersCtrl.orderList);

// Chi tiết 1 đơn hàng
router.get("/:id", ordersCtrl.orderDetail);

module.exports = router;
