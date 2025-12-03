const express = require('express')
const router = express.Router()
const validate = require('../../validates/admin/product.validate')
const multer  = require('multer')
const storage = require('../../helper/storageMulter')
const upload = multer({ storage: storage() });

const controller = require('../../controllers/admin/product.controller')

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete-product/:id', controller.deleteProduct)

router.get('/create', controller.create)

router.post('/create', upload.single('thumbnail'), validate.createProduct, controller.createProduct)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id', upload.single('thumbnail'), validate.createProduct, controller.editProduct)

router.get('/detail/:id', controller.detail)

module.exports = router