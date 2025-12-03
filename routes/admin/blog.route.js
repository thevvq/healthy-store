const express = require("express");
const router = express.Router();
const multer  = require('multer')
const storage = require('../../helper/storageMulter')
const upload = multer({ storage: storage() });

const blogAdminController = require("../../controllers/admin/blog.controller");

router.get("/", blogAdminController.index);

router.get("/create", blogAdminController.create);
router.post("/create",upload.single('thumbnail'), blogAdminController.store);

router.get("/edit/:id", blogAdminController.edit);
router.post("/edit/:id",upload.single('thumbnail'), blogAdminController.update);

router.get("/delete/:id", blogAdminController.delete);

module.exports = router;
