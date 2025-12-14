const Comment = require('../../models/comment.model');
const CommentReply = require('../../models/comment-reply.model');
const Product = require('../../models/product.model');
const sysConfig = require('../../config/system');

// [GET] /admin/comments
module.exports.index = async (req, res) => {
    try {
        // Lấy danh sách comments với thông tin product
        const comments = await Comment.find({ deleted: false })
            .populate('productId', 'title slug')
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });

        res.render('admin/pages/comment/index', {
            pageTitle: 'Quản lý bình luận',
            comments
        });
    } catch (err) {
        console.error('Comment List Error:', err);
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
    }
};

// [GET] /admin/comments/:id/detail
module.exports.detail = async (req, res) => {
    try {
        const commentId = req.params.id;

        const comment = await Comment.findOne({ _id: commentId, deleted: false })
            .populate('productId', 'title slug description')
            .populate('userId', 'fullName email');

        if (!comment) {
            req.flash('error', 'Bình luận không tồn tại!');
            return res.redirect(`${sysConfig.prefixAdmin}/comments`);
        }

        // Lấy replies cho comment này
        const replies = await CommentReply.find({ 
            commentId: commentId,
            deleted: false 
        })
            .populate('accountId', 'fullName email')
            .sort({ createdAt: 1 });

        res.render('admin/pages/comment/detail', {
            pageTitle: 'Chi tiết bình luận',
            comment,
            replies
        });
    } catch (err) {
        console.error('Comment Detail Error:', err);
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/comments`);
    }
};

// [POST] /admin/comments/:id/reply
module.exports.reply = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { content } = req.body;

        // Validate
        if (!content || !content.trim()) {
            req.flash('error', 'Nội dung trả lời không được để trống!');
            return res.redirect(`${sysConfig.prefixAdmin}/comments/${commentId}/detail`);
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            req.flash('error', 'Bình luận không tồn tại!');
            return res.redirect(`${sysConfig.prefixAdmin}/comments`);
        }

        // Tạo reply mới
        await CommentReply.create({
            commentId: commentId,
            productId: comment.productId,
            accountId: req.session.user._id,
            accountName: req.session.user.fullName || req.session.user.email,
            content: content.trim()
        });

        req.flash('success', 'Trả lời bình luận thành công!');
        res.redirect(`${sysConfig.prefixAdmin}/comments/${commentId}/detail`);
    } catch (err) {
        console.error('Comment Reply Error:', err);
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/comments`);
    }
};

// [PATCH] /admin/comments/:id/status/:status
module.exports.changeStatus = async (req, res) => {
    try {
        const commentId = req.params.id;
        const newStatus = req.params.status;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(newStatus)) {
            return res.json({
                success: false,
                message: 'Trạng thái không hợp lệ!'
            });
        }

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { status: newStatus },
            { new: true }
        );

        if (!comment) {
            return res.json({
                success: false,
                message: 'Bình luận không tồn tại!'
            });
        }

        return res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công!'
        });
    } catch (err) {
        console.error('Change Status Error:', err);
        return res.json({
            success: false,
            message: 'Có lỗi xảy ra, vui lòng thử lại!'
        });
    }
};

// [DELETE] /admin/comments/:id/delete
module.exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;

        await Comment.findByIdAndUpdate(
            commentId,
            { 
                deleted: true,
                deletedAt: new Date()
            }
        );

        // Xóa luôn replies
        await CommentReply.updateMany(
            { commentId: commentId },
            { 
                deleted: true,
                deletedAt: new Date()
            }
        );

        return res.json({
            success: true,
            message: 'Xóa bình luận thành công!'
        });
    } catch (err) {
        console.error('Delete Comment Error:', err);
        return res.json({
            success: false,
            message: 'Có lỗi xảy ra, vui lòng thử lại!'
        });
    }
};

// [DELETE] /admin/comments/:commentId/reply/:replyId/delete
module.exports.deleteReply = async (req, res) => {
    try {
        const replyId = req.params.replyId;

        await CommentReply.findByIdAndUpdate(
            replyId,
            { 
                deleted: true,
                deletedAt: new Date()
            }
        );

        return res.json({
            success: true,
            message: 'Xóa trả lời thành công!'
        });
    } catch (err) {
        console.error('Delete Reply Error:', err);
        return res.json({
            success: false,
            message: 'Có lỗi xảy ra, vui lòng thử lại!'
        });
    }
};
