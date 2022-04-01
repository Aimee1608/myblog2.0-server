import {Context} from 'koa';
import * as mongoose from 'mongoose'
import Comment from '../model/comment'
import User from '../model/user'
import Article from '../model/article'
import Browse from '../model/browse'
import Love from '../model/love'
import { isValidObjectId } from '../utils/tool'
import { getUserInfo, isAdminUser } from '../utils/user'
import { CustomError } from '../utils/customError'
import { decodeToken } from '../utils/token'
import {DecodeUserType, UserInfoType, CommentInfoType, CommentQueryType, ArticleInfoType, BrowseListType} from './../types/base'
import constants from '../utils/constants'
const { DEFAULT_NAME } = constants


async function queryAllComment(articleId: mongoose.ObjectId|string, item:CommentQueryType ):Promise<CommentQueryType[]> {
  let list = []
  const children:CommentInfoType[] = await Comment.find({ articleId, parentId: item._id })
  // console.log('children---', children, item);
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const nchild = JSON.parse(JSON.stringify(children[i]))
      const user:UserInfoType|null = await User.findOne({ userId: nchild.userId })
      // Object.assign(nchild, { username: user.username, avatar: user.avatar, parentUserId: item.userId, parentId: item._id, parentUsername: item.username, parentAvatar: item.avatar })
    if(user!=null){
      nchild.username = user.username
      nchild.avatar = user.avatar
    }
      nchild.parentUserId = item.userId
      nchild.parentUsername = item.username
      nchild.parentId = item._id
      nchild.parentAvatar = item.avatar
      nchild.label = item.label
      // console.log('nchild-------', nchild);
      list.push(nchild)
      const schild = await queryAllComment(articleId, nchild )
      // console.log('schild', schild);
      list = list.concat(schild)
    }
  }
  return list
}

class CommentController {
  static async getList(ctx:Context) {
    const { currentPage = 1, pageSize = 10, state = 1, articleId } = ctx.query
    // 过滤条件
    const options = {
      sort: {
        createDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    }
    // 参数
    const querys = {
      state,
      articleId,
      parentId: {
        $in: [null, '']
      }
    }
    // const querys = {};
    const result = await Comment.paginate(querys, options)
    const { docs } = result
    // console.log('docs---', docs)
    const promiseList = docs.map(
      (item:CommentInfoType) =>
        new Promise(async resolve => {
          const nitem = JSON.parse(JSON.stringify(item))
          // console.log('---item---', item)
          const user:UserInfoType|null = await User.findOne({ userId: item && item.userId ?item.userId: ''})
          if(user !==null){
            nitem.username = user.username
            nitem.avatar = user.avatar
            nitem.label = user.label
          }
         
          // Object.assign(nitem, item);
          // console.log('nitem---', nitem, nitem.username, user)
          const children = await queryAllComment(item.articleId ?item.articleId: '', nitem )
          nitem.children = children
          // console.log('-----res---', nitem)
          resolve(nitem)
        })
    )
    const list = await Promise.all(promiseList)
    const countTotal = await Comment.find({ state, articleId }).countDocuments()
    console.log('-----list---', list)
    const data = {
      pagination: {
        currentPage: result.page, // 当前页
        pageSize: result.limit, // 分页大小
        totalPage: result.pages, // 总页数
        total: result.total, // 总条数
        countTotal
      },
      list
    }

    ctx.data({ data })
  }

  static async add(ctx:Context) {
    const { articleId, content, parentId = null } = ctx.request.body
    // console.log('ctx.request.body', ctx.request.body)
    let userId:string|number = '游客'
    const userInfo:DecodeUserType|null = decodeToken(ctx)
    if (userInfo && userInfo.userId) {
      // userId = 'Aimee1608';
      userId = userInfo.userId
    }

    const res = await new Comment({
      userId,
      articleId,
      content,
      parentId
    }).save()
    const nitem = JSON.parse(JSON.stringify(res))
    const user:UserInfoType|null = await User.findOne({ userId })
    if(user !== null){
      nitem.username = user.username
      nitem.avatar = user.avatar
      nitem.label = user.label
    }
    if (parentId) {
      const parent:CommentInfoType|null = await Comment.findOne({ _id: parentId })
      if (parent!=null) {
        const parentUser:UserInfoType|null = await User.findOne({ userId: parent.userId })
        if(parentUser!=null){
          nitem.parentAvatar = parentUser.avatar
          nitem.parentUsername = parentUser.username
          nitem.parentUserId = parentUser.userId
        }
      }
    }
    ctx.data({ data: nitem })
  }

  static async getInfo(ctx:Context) {
    const { id } = ctx.query
    const { userId } = await getUserInfo(ctx)
    // const userId = 'Aimee1608';
    const res = await Comment.findOne({ articleId: id, userId })
    if (res) {
      ctx.data({ data: res })
    } else {
      ctx.data({ data: {} })
    }
  }

  static async getAdminList(ctx:Context) {
    const { currentPage = 1, pageSize = 10 } = ctx.query
    // 过滤条件
    const options = {
      sort: {
        createDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    }
    // 参数
    const querys = {}
    const result = await Comment.paginate(querys, options)
    const { docs } = result
    const data = {
      pagination: {
        currentPage: result.page, // 当前页
        pageSize: result.limit, // 分页大小
        totalPage: result.pages, // 总页数
        total: result.total // 总条数
      },
      list: docs
    }

    ctx.data({ data })
  }

  static async edit(ctx:Context) {
    const { _id, state } = ctx.request.body
    await isAdminUser(ctx)

    const res = await Comment.findOneAndUpdate({ _id }, { state })
    // console.log('res---', res)
    ctx.data({
      data: res
    })
  }

  static async delete(ctx:Context) {
    const { _id } = ctx.request.body
    if (!isValidObjectId(_id)) {
      throw new CustomError(500, '无效参数')
    }
    await isAdminUser(ctx)
    const result = await Comment.findByIdAndRemove(_id).catch(() => {
      throw new CustomError(500, '服务器内部错误')
    })
    if (result) {
      ctx.data({
        data: result
      })
    } else {
      ctx.data({
        code: 500
      })
    }
  }

  static async getTopComment(ctx:Context) {
    const options = {
      sort: {
        createDate: -1
      }, // 按id倒序
      page: 1, // 当前页
      limit: 10 // 每页数
    }
    // 参数
    const querys = { state: 1, parentId: null }
    const result = await Comment.paginate(querys, options)
    const { docs } = result
    let list = await Promise.all(
      docs.map(
        item =>
          new Promise(async resolve => {
            const { userId, content, createDate, articleId } = JSON.parse(JSON.stringify(item))
            console.log('getTopComment---->', articleId)
            let userInfo:UserInfoType|null = await User.findOne({ userId })
           
            if(userInfo!=null){
              let { username, avatar } = userInfo
              try {
                let title
                let isArticle
                if (typeof articleId == 'string'&& DEFAULT_NAME.hasOwnProperty(articleId)) {
                  title = Reflect.get(DEFAULT_NAME, articleId)
                  isArticle = false
                } else {
                  console.log('getTopComment---->article', articleId)
                  let articleInfo:ArticleInfoType|null = await Article.findOne({ _id: articleId })
                  if(articleInfo!=null){
                    console.log('getTopComment---->articleInfo', articleInfo.title)
                    title = articleInfo.title
                    isArticle = true
                  }
                }
                const newItem = {
                  articleId,
                  userId,
                  content,
                  createDate,
                  username,
                  avatar,
                  title,
                  isArticle
                }
                resolve(newItem)
                
              } catch (e) {
                resolve(null)
              }
            }
          })
      )
    )
    list = list.filter(item => item != null)
    const articleList = await Browse.find().distinct('articleId').exec()
    console.log('getTopComment---->browseList')
    let browseList:BrowseListType[] = await Promise.all(
      articleList.map(
        (item): Promise<BrowseListType>=>
          new Promise(async resolve => {
            console.log('item', item)
            const articleId = item
            const article:ArticleInfoType|null = await Article.findOne({ _id: articleId })
            const logList = await Browse.find({ articleId }).distinct('logId').exec()
            resolve({ title:article && article.title?article.title:'', count: logList.length, articleId })
          })
      )
    )
    browseList.sort((a, b) => {
      if (a.count > b.count) {
        return -1
      } else if (a.count === b.count) {
        return 0
      }
      return 1
    })
    browseList = browseList.splice(0, 10)
    const loveCount = await Love.countDocuments()
    ctx.data({
      data: {
        browseList,
        commentList: list,
        loveCount
      }
    })
  }

  static async getAllList(ctx:Context) {
    const result = await Comment.find()
    ctx.data({ data: result })
  }
}
export default CommentController
