const Blog = require("../../models/blog.model");

module.exports.getList = async ({ page = 1, limit = 8 } = {}) => {
    const skip = (page - 1) * limit;

    // Tổng số bài viết
    const totalBlogs = await Blog.countDocuments();

    const totalPages = Math.ceil(totalBlogs / limit);

    // Lấy danh sách blog theo phân trang
    const blogs = await Blog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        success: true,
        data: blogs,
        totalBlogs,
        totalPages,
        currentPage: page,
        totalPagesArr: Array.from({ length: totalPages }, (_, i) => i + 1)
    };
};

module.exports.getDetail = async (slug) => {
    const blog = await Blog.findOne({ slug });

    if (!blog) {
        return {
            success: false,
            message: "Không tìm thấy bài viết",
            data: null
        };
    }

    return {
        success: true,
        data: blog
    };
};
