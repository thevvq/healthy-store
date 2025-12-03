const User = require("../../models/user.model");

module.exports = {
    index: (req, res) => {
        if (!req.session.user) return res.redirect("/login");

        res.render("client/pages/profile/index", {
            title: "Thông tin tài khoản",
            user: req.session.user,
        });
    },

    updateProfile: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.json({ success: false, message: "Bạn chưa đăng nhập!" });
            }

            const currentUser = req.session.user;

            let avatar = currentUser.avatar || null;
            if (req.file) avatar = "/uploads/avatar/" + req.file.filename;

            const updatedUser = await User.findByIdAndUpdate(
                currentUser._id,
                {
                    fullName: req.body.fullName,
                    gender: req.body.gender,
                    birthday: req.body.birthday || null,
                    phone: req.body.phone,
                    address: req.body.address,
                    avatar: avatar
                },
                { new: true }
            );

            req.session.user = updatedUser;

            return res.json({
                success: true,
                user: updatedUser
            });

        } catch (error) {
            console.error(error);
            res.json({ success: false, message: "Cập nhật thất bại!" });
        }
    }
};
