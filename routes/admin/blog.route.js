const express = require("express");
const router = express.Router();
const blogAdminController = require("../../controllers/admin/blog.controller");

router.get("/", blogAdminController.index);
router.get("/create", blogAdminController.create);
router.post("/create", blogAdminController.store);

router.get("/edit/:id", blogAdminController.edit);
router.post("/edit/:id", blogAdminController.update);

router.get("/delete/:id", blogAdminController.delete);

module.exports = router;
