const Blog = require("../../models/blog.model");
const slugify = require("slugify");

module.exports = {
    // Danh sách blog
    index: async (req, res) => {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.render("admin/pages/blog/index", {
            title: "Quản lý Blog",
            blogs
        });
    },

    // Form tạo bài viết
    create: (req, res) => {
        res.render("admin/pages/blog/create", {
            title: "Thêm bài viết"
        });
    },

    // Lưu bài viết
    store: async (req, res) => {
        const { title, content, thumbnail } = req.body;

        await Blog.create({
            title,
            slug: slugify(title, { lower: true, strict: true }),
            content,
            thumbnail
        });

        res.redirect("/admin/blog");
    },

    // Form sửa bài viết
    edit: async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        res.render("admin/pages/blog/edit", {
            title: "Sửa bài viết",
            blog
        });
    },

    // Lưu sửa bài viết
    update: async (req, res) => {
        const { title, content, thumbnail } = req.body;

        await Blog.updateOne(
            { _id: req.params.id },
            {
                title,
                slug: slugify(title, { lower: true, strict: true }),
                content,
                thumbnail
            }
        );

        res.redirect("/admin/blog");
    },

    // Xóa
    delete: async (req, res) => {
        await Blog.deleteOne({ _id: req.params.id });
        res.redirect("/admin/blog");
    }
};
