const Account = require('../../models/user-client')
const bcrypt = require("bcrypt");

module.exports.login= async (req, res) => {
    const { email, password } = req.body

    const user = await Account.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        throw new Error("EMAIL_NOT_FOUND")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("PASSWORD_ERROR")
    }

    res.cookie('tokenClient', user.token)
    return
};

module.exports.logout = ( res) => {
    res.clearCookie('tokenClient');
};
