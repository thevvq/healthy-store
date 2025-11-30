const productService = require('../../services/admin/product.service')
const sysConfig = require('../../config/system')

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

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/products`)
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) =>{
    await productService.changeMulti(req, req.body.type, req.body.ids.split(','))
    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/products`)
}

// [DELETE] /admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
    await productService.deleteProduct(req.params.id)

    req.flash('success', 'Xóa sản phẩm thành công!')

    res.redirect(req.get('Referer') || `${sysConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {

    res.render('admin/pages/product/create', {
        pageTitle: 'Thêm sản phẩm mới'
    })
}

// [POST] /admin/products/create
module.exports.createProduct = async (req, res) => {
    await productService.createProduct(req)

    req.flash('success', 'Thêm sản phẩm thành công!')

    res.redirect(`${sysConfig.prefixAdmin}/products`)
    
}
