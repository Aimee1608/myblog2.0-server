const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  articleId: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  leaveParentId: {
    type: Number,
    required: false
  }, // 1 开启 0 不开启
  state: {
    type: Number,
    required: false,
    default: 1
  },
  // 发布日期
  createDate: {
    type: Date,
    default: Date.now()
  }
});

CommentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comment', CommentSchema, 'comment');
