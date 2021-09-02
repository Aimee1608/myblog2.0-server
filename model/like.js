const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LikeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  articleId: {
    type: String,
    required: false
  },
  // 发布日期
  createDate: {
    type: Date,
    default: Date.now
  }
});

LikeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('like', LikeSchema, 'like');
