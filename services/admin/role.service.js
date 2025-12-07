const Role = require('../../models/role.model')

module.exports.getList = async () => {
    let find = {deleted: false}

    return Role.find(find)
}

module.exports.createRole = async (req) => {
    const role = new Role(req.body)
    
    await role.save()
}

module.exports.edit = async (id) => {
    let find = {
        _id: id,
        deleted: false
    }

    return Role.findOne(find)
}

module.exports.editRole = async (id) => {
    await Role.updateOne({_id: id}, req.body)
}
