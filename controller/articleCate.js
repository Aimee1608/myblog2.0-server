// 活动类型控制器
const ArticleCate = require('../model/articleCate');

const {
  CustomError
} = require('../utils/customError');
const { isAdminUser } = require('../utils/user');

class articleCateController {
  // 获取活动类型列表
  static async getList(ctx) {
    const {
      currentPage = 1, pageSize = 10
    } = ctx.query;
    // 过滤条件
    const options = {
      sort: {
        lastModifiedDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    };
    // console.log('88888');
    // 查询
    const result = await ArticleCate
      .paginate({}, options)
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    console.log('result---', result);
    if (result) {
      ctx.data({
        data: {
          pagination: {
            currentPage: result.page, // 当前页
            pageSize: result.limit, // 分页大小
            totalPage: result.pages, // 总页数
            total: result.total // 总条数
          },
          list: result.docs
        }
      });
    } else {
      ctx.data({ code: 500 });
    }
  }

  static async getAllList(ctx) {
    const result = await ArticleCate.find()
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    if (result) {
      ctx.data({
        data: result
      });
    } else {
      ctx.data({
        code: 500
      });
    }
  }

  // 新增活动类型
  static async add(ctx) {
    // es6对象解构赋值
    const {
      name
    } = ctx.request.body; // 请求参数放在请求体
    const result = await new ArticleCate({
      name
    }).save()
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    if (result) {
      ctx.data({
        data: result
      });
    } else {
      ctx.data({
        code: 500
      });
    }
  }

  // 编辑活动类型
  static async edit(ctx) {
    const {
      _id,
      name,
      state
    } = ctx.request.body;

    if (!_id) {
      throw new CustomError(500, '无效参数');
    }

    const result = await ArticleCate
      .findByIdAndUpdate(_id, {
        name,
        state
      }) // new: true ？？？
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    console.log('result---ArticleCate', result);
    if (result) {
      ctx.data({
        data: result
      });
    } else {
      ctx.data({
        code: 500
      });
    }
  }

  // 删除活动类型
  static async delete(ctx) {
    const {
      _id
    } = ctx.request.body;
    if (!_id) {
      throw new CustomError(500, '无效参数');
    }
    await isAdminUser(ctx);
    const result = await ArticleCate
      .findByIdAndRemove(_id)
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    if (result) {
      ctx.data({
        data: result
      });
    } else {
      ctx.data({
        code: 500
      });
    }
  }
}

module.exports = articleCateController;
