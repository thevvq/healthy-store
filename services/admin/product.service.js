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
