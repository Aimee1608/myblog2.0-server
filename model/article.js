const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: true
  },
  // description: {
  //   type: String,
  //   required: false
  // },
  classId: { // 类别id
    type: String,
    required: false
  },
  // likeCount: {
  //   type: Number,
  //   required: false,
  //   default: 0
  // },
  // collectCount: {
  //   type: Number,
  //   required: false,
  //   default: 0
  // },
  // commentCount: {
  //   type: Number,
  //   required: false,
  //   default: 0
  // },
  // browseCount: {
  //   type: Number,
  //   required: false,
  //   default: 0
  // },
  isRecommend: { // 是否是推荐 0 否 1是
    type: Number,
    required: false,
    default: 1
  },
  isHot: { // 是否是热门  0 否 1是
    type: Number,
    required: false,
    default: 1
  },
  state: { // 1 开启 0 不开启
    type: Number,
    required: false,
    default: 1
  },

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

ArticleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('article', ArticleSchema, 'article');
