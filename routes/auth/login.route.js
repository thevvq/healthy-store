const express = require("express");
const router = express.Router();

const loginController = require("../../controllers/client/login.controller");

// Hiển thị form đăng nhập
router.get("/", loginController.renderLogin);

// Xử lý đăng nhập
router.post("/", loginController.handleLogin);

// Đăng xuất
router.get("/logout", loginController.logout);

module.exports = router;
