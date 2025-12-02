const Blog = require("../../models/blog.model");

module.exports = {
    index: async (req, res) => {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.render("client/pages/blog/index", {
            title: "Tin tức & Blog",
            blogs
        });
    },

    detail: async (req, res) => {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.render("client/pages/blog/detail", {
                title: "Không tìm thấy bài viết",
                blog: null
            });
        }

        res.render("client/pages/blog/detail", {
            title: blog.title,
            blog
        });
    }
};
