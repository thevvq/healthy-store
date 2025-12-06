const Category = require('../../models/category.model')
const uploadToCloud = require("../../helper/uploadCloud")
const createTreeHelper = require('../../helper/createTree')

module.exports.getList = async (req) => {
    const find = { deleted: false }
    
    const records = await Category.find(find)

    const tree = createTreeHelper.createTree(records)

    return tree
}

module.exports.create = async (req) => {
    const find = { deleted: false }
    
    const records = await Category.find(find)
    
    const tree = createTreeHelper.createTree(records)

    return tree
}

module.exports.createCategory = async (req) => {
    const body = req.body

    if (!body.position || body.position === "") {
        const count = await Category.countDocuments({ deleted: false })
        body.position = count + 1
    } else {
        body.position = parseInt(body.position)
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path)
        body.thumbnail = uploadResult.secure_url
    }

    const records = new Category(body)
    return records.save()
}