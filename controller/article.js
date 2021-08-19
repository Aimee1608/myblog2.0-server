const mongoose = require('mongoose');
const Article = require('../model/article');
const {
  isValidObjectId
} = require('../utils/tool');

class articleController {
  static async getList(ctx) {
    const {
      currentPage = 1, pageSize = 10, keywords = '', state = 1
    } = ctx.query;
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
    };
    // 参数
    const querys = { state };

    if (keywords) {
      if (isValidObjectId(keywords)) {
        querys.$or = [{
          _id: mongoose.Types.ObjectId(keywords)
        }];
      } else {
        querys.$or = [{
          title: {
            $regex: keywords
          },
          description: {
            $regex: keywords
          }
        }];
      }
    }
    const result = await Article
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
    ctx.data({ data: res });
  }
}
module.exports = articleController;
