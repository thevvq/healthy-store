const express = require('express')
const router = express.Router()
const multer  = require('multer')
const storage = require('../../helper/storageMulter')
const upload = multer({ storage: storage() });

const controller = require('../../controllers/admin/product.controller')

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete-product/:id', controller.deleteProduct)

router.get('/create', controller.create)

router.post('/create', upload.single('thumbnail'), controller.createProduct)

module.exports = router