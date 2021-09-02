const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const LoveSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  logId: {
    type: String,
    required: false
  },
  // 发布日期
  createDate: {
    type: Date,
    default: Date.now
  }
});

LoveSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('love', LoveSchema, 'love');
