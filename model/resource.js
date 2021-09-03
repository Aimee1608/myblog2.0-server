// 图片
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
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

resourceSchema.plugin(mongoosePaginate);

// 时间更新
resourceSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    lastModifiedDate: Date.now()
  });
  next();
});

// mongoose 会自动把表名变成复数
// 想要指定collection的名称，需要设置第三个参数
// mongoose.model 执行在数据库创建表的操作
module.exports = mongoose.model('resource', resourceSchema, 'resource');
