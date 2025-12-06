const express = require("express");
const router = express.Router();
const ordersController = require("../../controllers/client/orders.controller");

router.get("/", ordersController.orderList);
router.get("/:id", ordersController.orderDetail);

module.exports = router;
