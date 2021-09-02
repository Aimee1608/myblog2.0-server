const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ArticleCateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parentId: {
    type: String,
    required: false
  },
  state: {
    type: Number,
    required: false,
    default: 1
  }, // 1 开启 0 不开启
  // 发布日期
  createDate: {
    type: Date,
    default: Date.now
  },
  // 最后修改日期
  lastModifiedDate: {
    type: Date,
    default: Date.now
  }
});
ArticleCateSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('articleCate', ArticleCateSchema, 'articleCate');
