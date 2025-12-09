const accountService = require('../../services/admin/account.service')
const sysConfig = require('../../config/system')

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    try {
        const records = await accountService.getList()

        res.render('admin/pages/account/index', {
            pageTitle: 'Quản lý tài khoản',
            records
        })

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!')
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`)
    }
}