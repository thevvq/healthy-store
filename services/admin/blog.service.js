const Blog = require("../../models/blog.model");
const slugify = require("slugify");
const uploadToCloud = require("../../helper/uploadCloud");

// ========== LẤY DANH SÁCH BLOG ==========
module.exports.getList = async () => {
    return await Blog.find().sort({ createdAt: -1 });
};

// ========== TẠO BÀI VIẾT ==========
module.exports.createBlog = async (req) => {
    let thumbnail = "";

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        thumbnail = uploadResult.secure_url;
    }

    const blog = new Blog({
        title: req.body.title,
        slug: slugify(req.body.title, { lower: true, strict: true }),
        content: req.body.content,
        thumbnail: thumbnail
    });

    return await blog.save();
};

// ========== LẤY 1 BÀI VIẾT ==========
module.exports.getBlog = async (id) => {
    return await Blog.findById(id);
};

// ========== CẬP NHẬT BÀI VIẾT ==========
module.exports.updateBlog = async (req, id) => {
    let thumbnail = req.body.thumbnail || "";

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        thumbnail = uploadResult.secure_url;
    }

    return await Blog.updateOne(
        { _id: id },
        {
            title: req.body.title,
            slug: slugify(req.body.title, { lower: true, strict: true }),
            content: req.body.content,
            thumbnail: thumbnail
        }
    );
};

// ========== XÓA BÀI VIẾT ==========
module.exports.deleteBlog = async (id) => {
    return await Blog.deleteOne({ _id: id });
};
