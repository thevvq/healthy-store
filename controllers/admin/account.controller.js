const accountService = require('../../services/admin/account.service');
const sysConfig = require('../../config/system');

// =======================
// [GET] /admin/accounts
// =======================
module.exports.index = async (req, res) => {
    try {
        const records = await accountService.getList();

        res.render('admin/pages/account/index', {
            pageTitle: 'Quản lý tài khoản',
            records
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
    }
};


// =======================
// [GET] /admin/accounts/create
// =======================
module.exports.create = async (req, res) => {
    try {
        const roles = await accountService.create();

        res.render('admin/pages/account/create', {
            pageTitle: 'Thêm mới tài khoản',
            roles
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};


// =======================
// [POST] /admin/accounts/create
// =======================
module.exports.createAccount = async (req, res) => {
    try {
        await accountService.createAccount(req);

        req.flash('success', 'Tạo tài khoản thành công!');
        return res.redirect(`${sysConfig.prefixAdmin}/accounts`);

    } catch (err) {
        if (err.message === "EMAIL_EXISTS") {
            req.flash('error', 'Email đã tồn tại, vui lòng chọn email khác!');
        } else {
            req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        }

        return res.redirect('back');
    }
};


// =======================
// [PATCH] /admin/accounts/change-status/:status/:id
// =======================
module.exports.changeStatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        await accountService.changeStatus(id, status);

        req.flash('success', 'Cập nhật trạng thái thành công!');
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`);
};


// =======================
// [DELETE] /admin/accounts/delete-account/:id
// =======================
module.exports.deleteAccount = async (req, res) => {
    try {
        await accountService.deleteAccount(req.params.id);

        req.flash('success', 'Xóa tài khoản thành công!');
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`);
};


// =======================
// [GET] /admin/accounts/edit/:id
// =======================
module.exports.edit = async (req, res) => {
    try {
        const records = await accountService.edit(req);

        res.render('admin/pages/account/edit', {
            pageTitle: 'Chỉnh sửa tài khoản',
            ...records
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};


// =======================
// [PATCH] /admin/accounts/edit/:id
// 🔥 CẬP NHẬT SESSION KHI ADMIN SỬA CHÍNH MÌNH
// =======================
module.exports.editAccount = async (req, res) => {
    try {
        // ⚠️ service PHẢI return account sau update
        const updatedAccount = await accountService.editAccount(req);

        // ===============================
        // 🔥 CẬP NHẬT SESSION USER
        // ===============================
        if (
            req.session.user &&
            req.session.user._id &&
            req.session.user._id.toString() === req.params.id.toString()
        ) {
            req.session.user.fullName = updatedAccount.fullName;
            req.session.user.avatar = updatedAccount.avatar;
            req.session.user.phone = updatedAccount.phone;
            req.session.user.address = updatedAccount.address;
        }

        req.flash('success', 'Cập nhật tài khoản thành công!');

    } catch (err) {
        console.log(err);

        if (err.message === "EMAIL_EXISTS") {
            req.flash('error', 'Email đã tồn tại, vui lòng chọn email khác!');
        } else {
            req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        }
    }

    res.redirect(`${sysConfig.prefixAdmin}/accounts/edit/${req.params.id}`);
};


// =======================
// [GET] /admin/accounts/detail/:id
// =======================
module.exports.detail = async (req, res) => {
    try {
        const records = await accountService.detail(req);

        res.render('admin/pages/account/detail', {
            pageTitle: 'Chi tiết tài khoản',
            ...records
        });

    } catch (err) {
        req.flash('error', 'Không tìm thấy tài khoản!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};
