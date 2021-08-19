const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const CollectSchema = new mongoose.Schema({
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
    default: Date.now()
  }
});

CollectSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('collect', CollectSchema, 'collect');
