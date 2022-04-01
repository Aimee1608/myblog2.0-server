import * as mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const ArticleCateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
})
ArticleCateSchema.plugin(mongoosePaginate)
const model = mongoose.model('articleCate', ArticleCateSchema, 'articleCate')
export default model
