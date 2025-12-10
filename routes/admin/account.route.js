const express = require('express')
const router = express.Router()
const validate = require('../../validates/admin/account.validate')

const upload = require("../../config/multer")
const controller = require('../../controllers/admin/account.controller')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', upload.single('avatar'), validate.createPost, controller.createAccount)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.delete('/delete-account/:id', controller.deleteAccount)

module.exports = router  