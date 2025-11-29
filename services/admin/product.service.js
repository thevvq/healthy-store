const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filterStatus')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')

module.exports.getList = async (query) => {

    const filterStatus = filterStatusHelper(query)
    const find = { deleted: false }

    if (query.status) find.status = query.status

    const searchObject = searchHelper(query)
    if(searchObject.regex) find.title = searchObject.regex

    // Pagination
    const countProducts = await Product.countDocuments(find)
    const pagination = paginationHelper({
        currentPage: 1,
        limitItems: 8
    }, query, countProducts)

    const products = await Product
        .find(find)
        .limit(pagination.limitItems)
        .skip(pagination.skip)

    return {
        products,
        filterStatus,
        keyword: searchObject.keyword,
        pagination
    }
}

module.exports.changeStatus = async (id, status) => {
    return await Product.updateOne(
        { _id: id },
        { status }
    )
}

module.exports.changeMultiStatus = async (type, ids) => {
    const statusMap = {
        active: 'active',
        inactive: 'inactive'
    }

    const status = statusMap[type]
    if (!status) return

    await Product.updateMany(
        { _id: { $in: ids } },
        { status }
    )
}


