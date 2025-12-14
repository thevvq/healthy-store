const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/comment.controller');

// [GET] /admin/comments
router.get('/', controller.index);

// [GET] /admin/comments/:id/detail
router.get('/:id/detail', controller.detail);

// [POST] /admin/comments/:id/reply
router.post('/:id/reply', controller.reply);

// [PATCH] /admin/comments/:id/status/:status
router.patch('/:id/status/:status', controller.changeStatus);

// [DELETE] /admin/comments/:id/delete
router.delete('/:id/delete', controller.deleteComment);

// [DELETE] /admin/comments/:commentId/reply/:replyId/delete
router.delete('/:commentId/reply/:replyId/delete', controller.deleteReply);

module.exports = router;
