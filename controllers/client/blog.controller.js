const blogService = require("../../services/client/blog.service");

// [GET] /blog
module.exports.index = async (req, res) => {
    try {
        const result = await blogService.getList();

        res.render("client/pages/blog/index", {
            pageTitle: "Tin tức & Blog",
            blogs: result.data
        });

    } catch (err) {
        res.render("client/pages/blog/index", {
            pageTitle: "Tin tức & Blog",
            blogs: []
        });
    }
};

// [GET] /blog/:slug
module.exports.detail = async (req, res) => {
    try {
        const result = await blogService.getDetail(req.params.slug);

        if (!result.success) {
            return res.render("client/pages/blog/detail", {
                pageTitle: result.message,
                blog: null
            });
        }

        res.render("client/pages/blog/detail", {
            pageTitle: result.data.title,
            blog: result.data
        });

    } catch (err) {
        res.render("client/pages/blog/detail", {
            pageTitle: "Lỗi hệ thống",
            blog: null
        });
    }
};
