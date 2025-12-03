const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/client/profile.controller");
const uploadAvatar = require("../../middlewares/uploadAvatar.middleware");

// Hiển thị profile
router.get("/", profileController.index);

// Cập nhật profile (AJAX)
router.post("/", uploadAvatar.single("avatar"), profileController.updateProfile);

module.exports = router;
