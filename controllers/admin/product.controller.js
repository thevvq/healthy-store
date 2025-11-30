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
    await productService.changeStatus(req.params.id, req.params.status)

    req.flash('success', 'Cập nhật trạng thái thành công!')

    res.redirect(req.get('Referer') || `${req.app.locals.prefixAdmin}/products`)
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) =>{
    await productService.changeMulti(req, req.body.type, req.body.ids.split(','))
    res.redirect(req.get('Referer') || `${req.app.locals.prefixAdmin}/products`)
}

// [DELETE] /admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
    await productService.deleteProduct(req.params.id)

    req.flash('success', 'Xóa sản phẩm thành công!')

    res.redirect(req.get('Referer') || `${req.app.locals.prefixAdmin}/products`)
}
