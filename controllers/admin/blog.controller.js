const Blog = require("../../models/blog.model");
const slugify = require("slugify");

module.exports = {
    index: async (req, res) => {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.render("admin/pages/blog/index", {
            title: "Quản lý Blog",
            blogs
        });
    },

    create: (req, res) => {
        res.render("admin/pages/blog/create", {
            title: "Thêm bài viết"
        });
    },

    store: async (req, res) => {
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        const { title, content, thumbnail } = req.body;

        await Blog.create({
            title,
            slug: slugify(title, { lower: true, strict: true }),
            content,
            thumbnail
        });

        res.redirect("/admin/blog");
    },

    edit: async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        res.render("admin/pages/blog/edit", {
            title: "Sửa bài viết",
            blog
        });
    },

    update: async (req, res) => {
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

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

    delete: async (req, res) => {
        await Blog.deleteOne({ _id: req.params.id });
        res.redirect("/admin/blog");
    }
};
