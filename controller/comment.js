const mongoose = require('mongoose');
const Like = require('../model/like');
const Comment = require('../model/comment');
const {
  isValidObjectId
} = require('../utils/tool');
const { getUserInfo } = require('../utils/user');

class CommentController {
  static async getList(ctx) {
    const {
      currentPage = 1, pageSize = 10, state = 1, articleId
    } = ctx.query;
    // 过滤条件
    const options = {
      sort: {
        createDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    };
    // 参数
    const querys = { state, articleId };

    const result = await Comment
      .paginate(querys, options);
    const data = {
      pagination: {
        currentPage: result.page, // 当前页
        pageSize: result.limit, // 分页大小
        totalPage: result.pages, // 总页数
        total: result.total // 总条数
      },
      list: result.docs
    };
    ctx.data({ data });
  }

  static async add(ctx) {
    const { articleId, leaveParentId = null, content } = ctx.request.body;
    console.log('ctx.request.body', ctx.request.body);
    // const {
    //   userId
    // } = await getUserInfo(ctx);
    const userId = 'Aimee1608';
    const res = await new Comment({
      userId,
      articleId,
      content,
      leaveParentId
    }).save();
    ctx.data({ data: res });
  }

  static async getInfo(ctx) {
    const { id } = ctx.query;
    // const {
    //   userId
    // } = await getUserInfo(ctx);
    const userId = 'Aimee1608';
    const res = await Comment.findOne({ articleId: id, userId });
    if (res) {
      ctx.data({ data: res });
    } else {
      ctx.data({ data: {} });
    }
  }
}
module.exports = CommentController;
