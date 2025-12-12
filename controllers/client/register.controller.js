const { validationResult } = require("express-validator");
const registerService = require("../../services/client/register.service");

module.exports = {
    renderRegister: (req, res) => {
        res.render("client/pages/auth/register", {
            pageTitle: "Đăng ký tài khoản",
            error: null,
            errors: [],
            oldData: {}
        });
    },

    handleRegister: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("client/pages/auth/register", {
                pageTitle: "Đăng ký tài khoản",
                error: null,
                errors: errors.array(),
                oldData: req.body
            });
        }

        try {
            await registerService.register(req.body);
            return res.redirect("/login");

        } catch (err) {
            let errorMsg = "Lỗi hệ thống!";

            if (err.message === "EMAIL_EXISTS") {
                errorMsg = "Email đã tồn tại!";
            }

            return res.render("client/pages/auth/register", {
                pageTitle: "Đăng ký tài khoản",
                error: errorMsg,
                errors: [],
                oldData: req.body
            });
        }
    }
};
