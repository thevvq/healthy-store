const loginService = require("../../services/client/login.service");

module.exports = {
    renderLogin: (req, res) => {
        res.render("client/pages/auth/login", {
            pageTitle: "Đăng nhập"
        });
    },

    handleLogin: async (req, res) => {
        const { email, password } = req.body;

        const user = await loginService.login(email, password);

        if (!user) {
            return res.render("client/pages/auth/login", {
                pageTitle: "Đăng nhập",
                error: "Email hoặc mật khẩu không đúng!"
            });
        }

        // Lưu session
        req.session.user = user;

        return res.redirect("/");
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }
};
