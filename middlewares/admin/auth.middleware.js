const Account = require('../../models/user.model');
const Role = require('../../models/role.model');
const sysConfig = require('../../config/system')

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash("error", "Bạn cần đăng nhập!");
        return res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }

    const user = await Account.findOne({ token, deleted: false }).select('-password');

    if (!user) {
        req.flash("error", "Phiên đăng nhập không hợp lệ!");
        return res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản bị khóa!");
        return res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }
    const role = await Role.findById(user.role_id).select('title permissions');

    res.locals.user = user;
    res.locals.role = role;
    next();
};
