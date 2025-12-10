const blogService = require("../../services/client/blog.service");

// [GET] /blog
module.exports.index = async (req, res) => {
    try {
        // Lấy số trang từ query ?page=2
        const page = parseInt(req.query.page) || 1;

        // Lấy data từ service (đã phân trang)
        const result = await blogService.getList({ page, limit: 8 });

        res.render("client/pages/blog/index", {
            pageTitle: "Tin tức & Blog",
            blogs: result.data,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            totalPagesArr: result.totalPagesArr
        });

    } catch (err) {
        console.log(err);
        res.render("client/pages/blog/index", {
            pageTitle: "Tin tức & Blog",
            blogs: [],
            totalPages: 0,
            currentPage: 1,
            totalPagesArr: []
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
        console.log(err);
        res.render("client/pages/blog/detail", {
            pageTitle: "Lỗi hệ thống",
            blog: null
        });
    }
};
