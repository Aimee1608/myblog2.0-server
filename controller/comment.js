
const _ = require('loadsh');
const Like = require('../model/like');
const Comment = require('../model/comment');
const User = require('../model/user')
const {
  isValidObjectId
} = require('../utils/tool');
const { getUserInfo } = require('../utils/user');

async function queryAllComment({ articleId, item }) {
  let list = [];
  let children = await Comment.find({ articleId, parentId: item._id });
  // console.log('children---', children, item);
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const nchild = JSON.parse(JSON.stringify(children[i]))
      const user = await User.findOne({ userId: nchild.userId });
      // Object.assign(nchild, { username: user.username, avatar: user.avatar, parentUserId: item.userId, parentId: item._id, parentUsername: item.username, parentAvatar: item.avatar })
      nchild.username = user.username
      nchild.avatar = user.avatar
      nchild.parentUserId = item.userId
      nchild.parentUsername = item.username
      nchild.parentId = item._id
      nchild.parentAvatar = item.avatar
      // console.log('nchild-------', nchild);
      list.push(nchild);
      const schild = await queryAllComment({ articleId, item: nchild })
      // console.log('schild', schild);
      list = list.concat(schild)
    }
  }
  console.log('list', list);
  return list;
}

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
    // const querys = { state, articleId, parentId: null };
    const querys = {}
    const result = await Comment
      .paginate(querys, options);
    const { docs } = result;
    console.log('docs---', docs)
    const promiseList = docs.map((item) => {

      return new Promise(async reslove => {
        const nitem = JSON.parse(JSON.stringify(item))
        console.log('---item---', item)
        const user = await User.findOne({ userId: item.userId });
        nitem.username = user.username;
        nitem.avatar = user.avatar;
        // Object.assign(nitem, item);
        console.log('nitem---', nitem, nitem.username, user)
        const children = await queryAllComment({ articleId: item.articleId, item: nitem })
        nitem.children = children
        console.log('-----res---', nitem)
        reslove(nitem)
      })
    })
    const list = await Promise.all(promiseList)
    console.log('-----list---', list)
    const data = {
      pagination: {
        currentPage: result.page, // 当前页
        pageSize: result.limit, // 分页大小
        totalPage: result.pages, // 总页数
        total: result.total // 总条数
      },
      list
    };

    ctx.data({ data });
  }

  static async add(ctx) {
    const { articleId, content, parentId = null, isTourist } = ctx.request.body;
    console.log('ctx.request.body', ctx.request.body);
    let userId = '游客'
    if (!isTourist) {
      userId = 'Aimee1608';
      const userInfo = await getUserInfo(ctx);
      userId = userInfo.userId;
    }

    const res = await new Comment({
      userId,
      articleId,
      content,
      parentId
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
