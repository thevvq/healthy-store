const blogService = require("../../services/admin/blog.service");
const sysConfig = require("../../config/system");

module.exports = {
    // [GET] /admin/blog
    index: async (req, res) => {
        try {
            const {
                keyword = "",
                sort = "newest",
                month = "",
                year = "",
                page = 1
            } = req.query;

            const result = await blogService.getList({
                keyword,
                sort,
                month,
                year,
                page
            });

            // xây baseQuery để dùng cho link phân trang
            const qs = new URLSearchParams();
            if (keyword) qs.set("keyword", keyword);
            if (sort) qs.set("sort", sort);
            if (month) qs.set("month", month);
            if (year) qs.set("year", year);

            const baseQuery = qs.toString(); // vd: keyword=abc&sort=title_za

            res.render("admin/pages/blog/index", {
                pageTitle: "Quản lý Blog",
                blogs: result.docs,
                totalBlogs: result.total,
                page: result.page,
                totalPages: result.totalPages,
                keyword,
                sort,
                filterMonth: month,
                filterYear: year,
                yearOptions: result.years,
                baseQuery
            });
        } catch (err) {
            console.error(err);
            req.flash("error", "Không thể tải danh sách blog!");
            res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
        }
    },

    // [GET] /admin/blog/create
    create: (req, res) => {
        res.render("admin/pages/blog/create", {
            pageTitle: "Thêm bài viết"
        });
    },

    // [POST] /admin/blog/create
    store: async (req, res) => {
        try {
            await blogService.createBlog(req);
            req.flash("success", "Thêm bài viết thành công!");
        } catch (err) {
            console.log(err);
            req.flash("error", "Có lỗi xảy ra khi tạo bài viết!");
        }
        res.redirect("/admin/blog");
    },

    // [GET] /admin/blog/edit/:id
    edit: async (req, res) => {
        try {
            const blog = await blogService.getBlog(req.params.id);

            res.render("admin/pages/blog/edit", {
                pageTitle: "Sửa bài viết",
                blog
            });
        } catch (err) {
            req.flash("error", "Không thể tải bài viết!");
            res.redirect("/admin/blog");
        }
    },

    // [POST] /admin/blog/edit/:id
    update: async (req, res) => {
        try {
            await blogService.updateBlog(req, req.params.id);
            req.flash("success", "Cập nhật bài viết thành công!");
        } catch (err) {
            console.log(err);
            req.flash("error", "Lỗi cập nhật!");
        }
        res.redirect("/admin/blog");
    },

    // [GET] /admin/blog/delete/:id
    delete: async (req, res) => {
        try {
            await blogService.deleteBlog(req.params.id);
            req.flash("success", "Xóa bài viết thành công!");
        } catch (err) {
            console.log(err);
            req.flash("error", "Không thể xóa bài viết!");
        }
        res.redirect("/admin/blog");
    }
};
