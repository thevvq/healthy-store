const blogService = require("../../services/admin/blog.service");
const sysConfig = require("../../config/system");

module.exports = {
    // [GET] /admin/blog
    index: async (req, res) => {
        try {
            const blogs = await blogService.getList();

            res.render("admin/pages/blog/index", {
                title: "Quản lý Blog",
                blogs
            });
        } catch (err) {
            req.flash("error", "Không thể tải danh sách blog!");
            res.redirect(req.get("Referer") || `${sysConfig.prefixAdmin}/dashboard`);
        }
    },

    // [GET] /admin/blog/create
    create: (req, res) => {
        res.render("admin/pages/blog/create", {
            title: "Thêm bài viết"
        });
    },

    // [POST] /admin/blog/create
    store: async (req, res) => {
        try {
            await blogService.createBlog(req);
            req.flash("success", "Thêm bài viết thành công!");
        } catch (err) {
            req.flash("error", "Có lỗi xảy ra khi tạo bài viết!");
        }

        res.redirect(req.get("Referer") || `${sysConfig.prefixAdmin}/blog`);
    },

    // [GET] /admin/blog/edit/:id
    edit: async (req, res) => {
        try {
            const blog = await blogService.getBlog(req.params.id);

            res.render("admin/pages/blog/edit", {
                title: "Sửa bài viết",
                blog
            });
        } catch (err) {
            req.flash("error", "Không thể tải thông tin bài viết!");
            res.redirect(req.get("Referer") || `${sysConfig.prefixAdmin}/blog`);
        }
    },

    // [PATCH] /admin/blog/edit/:id
    update: async (req, res) => {
        try {
            await blogService.updateBlog(req, req.params.id);
            req.flash("success", "Cập nhật bài viết thành công!");
        } catch (err) {
            req.flash("error", "Có lỗi xảy ra khi cập nhật bài viết!");
        }

        res.redirect(req.get("Referer") || `${sysConfig.prefixAdmin}/blog`);
    },

    // [DELETE] /admin/blog/delete/:id
    delete: async (req, res) => {
        try {
            await blogService.deleteBlog(req.params.id);
            req.flash("success", "Xóa bài viết thành công!");
        } catch (err) {
            req.flash("error", "Có lỗi xảy ra khi xóa bài viết!");
        }

        res.redirect(req.get("Referer") || `${sysConfig.prefixAdmin}/blog`);
    }
};
