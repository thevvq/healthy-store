const registerService = require("../../services/client/register.service");

// HIỂN THỊ FORM
module.exports.showRegisterForm = (req, res) => {
    res.render("client/pages/auth/register", {
        pageTitle: "Đăng ký tài khoản",
        old: {}
    });
};

// XỬ LÝ ĐĂNG KÝ
module.exports.handleRegister = async (req, res) => {
    try {
        const result = await registerService.register(req.body);

        if (result.error) {
            return res.render("client/pages/auth/register", {
                pageTitle: "Đăng ký tài khoản",
                error: result.error,
                old: req.body
            });
        }
        
        // 🔥 Gửi thông báo thành công
        req.flash("success", "Đăng ký thành công.");

        return res.redirect("/login");


    } catch (err) {
        console.error("Register Error:", err);
        return res.render("client/pages/auth/register", {
            pageTitle: "Đăng ký tài khoản",
            error: "Lỗi hệ thống!",
            old: req.body
        });
    }
};
