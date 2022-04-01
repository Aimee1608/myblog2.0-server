import * as mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

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
    default: Date.now
  }
})

CollectSchema.plugin(mongoosePaginate)
const model = mongoose.model('collect', CollectSchema, 'collect')
export default model
