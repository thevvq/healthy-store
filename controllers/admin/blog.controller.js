const blogService = require("../../services/admin/blog.service");

module.exports = {
    // [GET] /admin/blog
    index: async (req, res) => {
        const blogs = await blogService.getList();

        res.render("admin/pages/blog/index", {
            title: "Quản lý Blog",
            blogs
        });
    },

    // [GET] /admin/blog/create
    create: (req, res) => {
        res.render("admin/pages/blog/create", {
            title: "Thêm bài viết"
        });
    },

    // [POST] /admin/blog/create
    store: async (req, res) => {
        await blogService.createBlog(req);
        res.redirect("/admin/blog");
    },

    // [GET] /admin/blog/edit/:id
    edit: async (req, res) => {
        const blog = await blogService.getBlog(req.params.id);

        res.render("admin/pages/blog/edit", {
            title: "Sửa bài viết",
            blog
        });
    },

    // [PATCH] /admin/blog/edit/:id
    update: async (req, res) => {
        await blogService.updateBlog(req, req.params.id);
        res.redirect("/admin/blog");
    },

    // [DELETE] /admin/blog/delete/:id
    delete: async (req, res) => {
        await blogService.deleteBlog(req.params.id);
        res.redirect("/admin/blog");
    }
};
