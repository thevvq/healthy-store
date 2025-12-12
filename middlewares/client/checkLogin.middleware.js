const Account = require('../../models/user-client');

module.exports.requireAuthClient = async (req, res, next) => {
    try {
        const token = req.cookies.tokenClient;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Bạn cần đăng nhập!"
            });
        }

        const user = await Account.findOne({ token, deleted: false }).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
            });
        }

        res.locals.user = user;

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};
