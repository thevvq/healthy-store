const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filterStatus')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')

// [GET] /admin/products
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query)

    const find = {
        deleted: false
    }
    
    if (req.query.status){
        find.status = req.query.status
    }

    const searchObject = searchHelper(req.query)
    if(searchObject.regex){
        find.title = searchObject.regex
    }

    // Pagination
    const countProducts = await Product.countDocuments(find)
    const objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts)
    
    // End Pagination

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

    res.render('admin/pages/product/index', {
        pageTitle: 'Trang sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
        pagination: objectPagination
    })
}