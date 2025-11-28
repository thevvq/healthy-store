const productService = require('../../services/client/product.service')

module.exports.index = async (req, res) => {
    const products = await productService.getList()

    res.render('client/pages/products/index', {
        pageTitle: 'Trang danh sách sản phẩm',
        products
    })
}
