import * as mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

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
})

LoveSchema.plugin(mongoosePaginate)
const model = mongoose.model('love', LoveSchema, 'love')
export default model
