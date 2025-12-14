const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentReplySchema = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    accountName: {
      type: String,
      trim: true,
      default: ''
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CommentReply', CommentReplySchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentReplySchema = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    accountName: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

module.exports = mongoose.model('CommentReply', CommentReplySchema);
