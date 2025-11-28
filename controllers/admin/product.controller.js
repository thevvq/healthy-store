const productService = require('../../services/admin/product.service')

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const data = await productService.getList(req.query)

    res.render('admin/pages/product/index', {
        pageTitle: 'Trang sản phẩm',
        ...data
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) =>{
    const id = req.params.id
    const status = req.params.status

    await productService.updateStatus(id, status)

    res.redirect(req.get('Referer') || `${req.app.locals.prefixAdmin}/products`)
}
