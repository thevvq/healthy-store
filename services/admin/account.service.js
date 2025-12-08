const Account = require('../../models/user.model')

module.exports.getList = async () => {
    let find = {deleted: false}

    return Account.find(find)
}
