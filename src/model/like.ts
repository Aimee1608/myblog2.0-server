import * as mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

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
})

LikeSchema.plugin(mongoosePaginate)
const model = mongoose.model('like', LikeSchema, 'like')
export default model
