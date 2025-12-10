const express = require("express");
const router = express.Router();

const registerController = require("../../controllers/client/register.controller");

// Hiển thị form đăng ký
router.get("/", registerController.showRegisterForm);

// Xử lý đăng ký
router.post("/", registerController.handleRegister);

module.exports = router;
