const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filterStatus')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
const uploadToCloud = require("../../helper/uploadCloud")

module.exports.getList = async (query) => {
    const filterStatus = filterStatusHelper(query)
    const find = { deleted: false }

    if (query.status) find.status = query.status

    const searchObject = searchHelper(query)
    if (searchObject.regex) find.title = searchObject.regex

    const totalProducts = await Product.countDocuments(find)
    const pagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 6
        },
        query,
        totalProducts
    )

    let sort = {};

    if (query.sort) {
        const [field, order] = query.sort.split("-")
        sort[field] = order === "asc" ? 1 : -1
    } else {
        sort = { position: -1 }
    }


    const products = await Product.find(find)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limitItems)

    return {
        products,
        filterStatus,
        keyword: searchObject.keyword,
        pagination
    }
}

module.exports.changeStatus = async (id, status) => {
    return Product.updateOne({ _id: id }, { status })
}

module.exports.changeMulti = async (type, ids) => {
    const actions = {
        active: { status: "active" },
        inactive: { status: "inactive" },
        "delete-all": "delete",
        "change-position": "position"
    }

    const action = actions[type]
    if (!action) {
        return { status: "error", message: "Hành động không hợp lệ!" }
    }

    if (action === "delete") {
        await Product.updateMany(
            { _id: { $in: ids } },
            {
                deleted: true,
                deletedAt: new Date()
            }
        )

        return {
            status: "success",
            message: `Đã xóa ${ids.length} sản phẩm!`
        }
    }

    if (action === "position") {
        for (const item of ids) {
            const [id, position] = item.split('-')
            await Product.updateOne(
                { _id: id },
                { position: parseInt(position) }
            )
        }

        return {
            status: "success",
            message: `Đã cập nhật vị trí ${ids.length} sản phẩm!`
        }
    }

    await Product.updateMany(
        { _id: { $in: ids } },
        { status: action.status }
    )

    return {
        status: "success",
        message: `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`
    }
}

module.exports.deleteProduct = async (id) => {
    return Product.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        }
    )
}

module.exports.createProduct = async (req) => {
    const body = req.body

    body.price = parseInt(body.price)
    body.discountPercentage = parseInt(body.discountPercentage)
    body.stock = parseInt(body.stock)

    if (!body.position || body.position === "") {
        const count = await Product.countDocuments({ deleted: false })
        body.position = count + 1
    } else {
        body.position = parseInt(body.position)
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path)
        body.thumbnail = uploadResult.secure_url
    }

    const product = new Product(body)
    return product.save()
}

module.exports.detail = async (id) => {
    return Product.findOne({ deleted: false, _id: id })
}

module.exports.editProduct = async (req, id) => {
    const body = req.body

    body.price = parseInt(body.price)
    body.discountPercentage = parseInt(body.discountPercentage)
    body.stock = parseInt(body.stock)
    body.position = parseInt(body.position)

    if (body.removeThumbnail === "1") {
        body.thumbnail = ""
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path)
        body.thumbnail = uploadResult.secure_url
    }

    const result = await Product.updateOne({ _id: id }, body)
    return result.modifiedCount > 0
}
