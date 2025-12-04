const Blog = require("../../models/blog.model");

module.exports.getList = async () => {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return {
        success: true,
        data: blogs
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
