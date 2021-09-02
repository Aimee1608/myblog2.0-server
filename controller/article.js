const mongoose = require('mongoose');
const Article = require('../model/article');
const ArticleCate = require('../model/articleCate');
const Collect = require('../model/collect');
const Like = require('../model/like');
const Comment = require('../model/comment');
const {
  isValidObjectId,
  getArticleTime
} = require('../utils/tool');
const Browse = require('../model/browse');
const { decodeToken } = require('../utils/token');
const { getLogId, getUserInfo } = require('../utils/user');

function getAllClassId(classId, list) {
  let newList = [];
  list.forEach((item) => {
    if (item._id === classId) {
      newList.push(item._id);
    } else if (item.parentId === classId) {
      newList.push(item._id);
    }
    if (item.children && item.children.length > 0) {
      const children = getAllClassId(classId, item.children);
      newList = newList.concat(children);
    }
  });
  return newList;
}

async function getClassId(classId) {
  const list = [];
  const parent = await ArticleCate.find({ parentId: classId });
  if (parent.length > 0) {
    for (let i = 0; i < parent.length; i++) {
      const item = JSON.parse(JSON.stringify(parent[i]));
      item.children = await getClassId(item._id);
      const ids = getAllClassId(item._id, item.children);
      ids.push(item._id);
      item.count = await Article.countDocuments({ classId: { $in: ids } });
      list.push(item);
    }
  }
  return list;
}

async function getCountById(id) {
  const likeCount = await Like.countDocuments({ articleId: id });
  const collectCount = await Collect.countDocuments({ articleId: id });
  const commentCount = await Comment.countDocuments({ articleId: id, state: 1 });
  const browse = await Browse.find({ articleId: id }).distinct('logId').exec();
  const browseCount = browse.length;
  return {
    likeCount, collectCount, commentCount, browseCount
  };
}

async function getUserArticleList(ctx, collection) {
  const { userId } = await getUserInfo(ctx);
  const likeList = await collection.find({ userId });
  const likeIds = likeList.map((item) => mongoose.Types.ObjectId(item.articleId));
  const and = [
    {
      _id: {
        $in: likeIds
      }
    }
  ];
  return and;
}
class articleController {
  static async getList(ctx) {
    const {
      currentPage = 1, pageSize = 10, keywords = '', state = 1, like = 0, collect = 0
    } = ctx.query;
    // 过滤条件
    const options = {
      sort: {
        lastModifiedDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    };
    // 参数
    const querys = { state: +state };

    if (keywords) {
      if (isValidObjectId(keywords)) {
        querys.$or = [{
          _id: mongoose.Types.ObjectId(keywords)
        }];
      } else {
        querys.$or = [{
          title: {
            $regex: keywords
          }
          // description: {
          //   $regex: keywords
          // }
        }];
      }
    }
    console.log(888, querys.$or);
    if (+like) {
      querys.$and = await getUserArticleList(ctx, Like);
    }
    if (+collect) {
      querys.$and = await getUserArticleList(ctx, Collect);
    }
    const result = await Article
      .paginate(querys, options);
    const list = await Promise.all(result.docs.map((item) => new Promise((resolve) => {
      getCountById(item._id).then((counts) => {
        const data = JSON.parse(JSON.stringify(item));
        resolve({ ...data, ...counts });
      });
    })));
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
    const { title, classId, content } = ctx.request.body;
    console.log('title', title, content);
    const res = await new Article({
      title,
      content,
      classId,
      image: 'https://tpc.googlesyndication.com/simgad/15117929136808882740/downsize_200k_v1?w=400&h=209'
    }).save();
    ctx.data({ data: res });
  }

  static async edit(ctx) {
    const {
      _id, title, classId, content
    } = ctx.request.body;
    const res = await Article.findOneAndUpdate({ _id }, {
      title,
      classId,
      content,
      lastModifiedDate: new Date()
    });
    ctx.data({ data: res });
  }

  static async getInfo(ctx) {
    const { id } = ctx.query;
    const res = await Article.findOne({ _id: id });
    let userId = '游客';
    const userInfo = decodeToken(ctx);
    if (userInfo) {
      // userId = 'Aimee1608';
      userId = userInfo.userId;
    }
    const logId = getLogId(ctx);
    await new Browse({
      articleId: id,
      userId,
      logId
    }).save();
    const counts = await getCountById(id);
    ctx.data({
      data: {
        ...JSON.parse(JSON.stringify(res)), ...counts
      }
    });
  }

  static async getListByClass(ctx) {
    const {
      classId = null
    } = ctx.query;
    const query = {};

    const classList = await getClassId(null);
    if (classId) { // 找到分类id 下面的子分类id
      const list = getAllClassId(classId, classList);
      console.log('list---', list);
      query.classId = {
        $in: list
      };
    }

    const res = await Article.find(query, { createDate: 1, title: 1 }, { sort: { createDate: -1 } });
    console.log('articleList---', res, classId);
    const articleList = getArticleTime(res);
    ctx.data({
      data: {
        classList,
        articleList
      }
    });
  }
}
module.exports = articleController;
