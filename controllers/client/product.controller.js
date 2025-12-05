const productService = require('../../services/client/product.service')

module.exports.index = async (req, res) => {
    const products = await productService.getList()

    res.render('client/pages/products/index', {
        pageTitle: 'Trang danh sách sản phẩm',
        products
    })
}

module.exports.detail = async (req, res) => {
    const product = await productService.detail(req.params.slug)

    res.render('client/pages/products/detail', {
        pageTitle: product.title,
        product
    })
}

