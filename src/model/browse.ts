import * as mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const BrowseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  articleId: {
    type: String,
    required: false
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

BrowseSchema.plugin(mongoosePaginate)
const model = mongoose.model('browse', BrowseSchema, 'browse')
export default model
