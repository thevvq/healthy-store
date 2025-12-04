const profileService = require("../../services/client/profile.service");

// [GET] client/profile
module.exports.index = (req, res) => {
    try {
        const loggedIn = profileService.checkLogin(req.session.user);

        if (!loggedIn) {
            return res.redirect("/login");
        }

        res.render("client/pages/profile/index", {
            pageTitle: "Thông tin tài khoản",
            user: req.session.user,
        });

    } catch (err) {
        console.error(err);
        res.redirect("/login");
    }
};

// [POST] client/profile
module.exports.updateProfile = async (req, res) => {
    try {
        const loggedIn = profileService.checkLogin(req.session.user);

        if (!loggedIn) {
            return res.json({
                success: false,
                message: "Bạn chưa đăng nhập!"
            });
        }

        // Lấy package update từ service
        const updatePackage = profileService.prepareUpdateData(req);

        // Update DB
        const updatedUser = await profileService.updateUserInDatabase(
            updatePackage.id,
            updatePackage.data
        );

        // Cập nhật session
        req.session.user = updatedUser;

        return res.json({
            success: true,
            message: "Cập nhật thành công!",
            user: updatedUser
        });

    } catch (err) {
        console.error(err);

        return res.json({
            success: false,
            message: "Cập nhật thất bại!"
        });
    }
};
