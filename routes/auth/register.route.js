const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

// Hiển thị form đăng ký
router.get("/", (req, res) => {
    res.render("client/pages/auth/register", {
        pageTitle: "Đăng ký tài khoản"
    });
});

// Xử lý đăng ký
router.post("/", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.render("client/pages/auth/register", {
                pageTitle: "Đăng ký tài khoản",
                error: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        const exist = await User.findOne({ email });
        if (exist) {
            return res.render("client/pages/auth/register", {
                pageTitle: "Đăng ký tài khoản",
                error: "Email đã tồn tại!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            password: hashedPassword
        });

    

        return res.redirect("/login");

    } catch (error) {
        console.error(error);
        return res.render("client/pages/auth/register", {
            pageTitle: "Đăng ký tài khoản",
            error: "Lỗi hệ thống!"
        });
    }
});

module.exports = router;
