import * as mongoose from 'mongoose'
import {Context} from 'koa';
import Like from '../model/like'
import { isValidObjectId } from '../utils/tool'
import { getUserInfo} from '../utils/user'
import { ArticleQueryType } from '../types/base';

class likeController {
  static async getList(ctx:Context) {
    const { currentPage = 1, pageSize = 10, keywords = '', state = 1 } = ctx.query
    // 过滤条件
    const options = {
      title: {
        $regex: keywords
      },
      sort: {
        lastModifiedDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    }
    // 参数
    const querys:ArticleQueryType = {  }
    if(typeof state == 'number'){
      querys.state = state
    }
    if (typeof keywords === 'string' && keywords) {
      if (isValidObjectId(keywords)) {
        querys.$or = [
          {
            _id: mongoose.Types.ObjectId(keywords)
          }
        ]
      } else {
        querys.$or = [
          {
            title: {
              $regex: keywords
            },
            description: {
              $regex: keywords
            }
          }
        ]
      }
    }
    const result = await Like.paginate(querys, options)
    const data = {
      pagination: {
        currentPage: result.page, // 当前页
        pageSize: result.limit, // 分页大小
        totalPage: result.pages, // 总页数
        total: result.total // 总条数
      },
      list: result.docs
    }
    ctx.data({ data })
  }

  static async edit(ctx:Context) {
    const { id, value } = ctx.request.body
    console.log('id', id, value)
    const { userId } = await getUserInfo(ctx)
    // const userId = 'Aimee1608';
    if (value) {
      const res = await new Like({
        userId,
        articleId: id
      }).save()
    } else {
      const res = await Like.findOneAndRemove({
        userId,
        articleId: id
      })
    }
    ctx.data({ data: {} })
  }

  static async getInfo(ctx:Context) {
    const { id } = ctx.query
    const { userId } = await getUserInfo(ctx)
    // const userId = 'Aimee1608';
    const res = await Like.findOne({ articleId: id, userId })
    if (res) {
      ctx.data({ data: res })
    } else {
      ctx.data({ data: {} })
    }
  }
}
export default likeController
