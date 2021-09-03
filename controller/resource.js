// 活动类型控制器
const Resource = require('../model/resource');
const { getUserInfo } = require('../utils/user');
const {
  CustomError
} = require('../utils/customError');
const { baseUploadUrl } = require('../config');

class resourceController {
  // 获取活动类型列表
  static async getList(ctx) {
    const {
      currentPage = 1, pageSize = 10
    } = ctx.query;
    const {
      userId
    } = await getUserInfo(ctx);
    // 过滤条件
    const options = {
      sort: {
        lastModifiedDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    };
    console.log('88888', pageSize, ctx.query);
    const query = { userId };
    // 查询
    const result = await Resource
      .paginate(query, options)
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    // console.log('result---', result);
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
      ctx.data({ code: 1001 });
    }
  }

  // 新增活动类型
  static async add(ctx) {
    // es6对象解构赋值
    const {
      files
    } = ctx.request.body; // 请求参数放在请求体
    const {
      userId
    } = await getUserInfo(ctx);
    const list = JSON.parse(files);
    console.log('files', files, list);
    const rList = list.map((file) => (
      new Promise(async (reslove) => {
        const { name, md5Name } = file;
        const url = `https://editor.xesimg.com/tailor/logadmin/resource/${md5Name}`;
        const res = await new Resource({
          userId,
          name,
          url,
          // 发布日期
          createDate: new Date(),
          // 最后修改日期
          lastModifiedDate: new Date()
        })
          .save()
          .catch(() => {
            throw new CustomError(500, '服务器内部错误');
          });
        reslove(res);
      })

    ));
    const result = await Promise.all(rList);
    if (result) {
      ctx.data({
        data: result
      });
    } else {
      ctx.data({ code: 1001 });
    }
  }

  // 编辑活动类型
  static async edit(ctx) {
    const _id = ctx.params.id;
    const {
      name
    } = ctx.request.body;

    if (!_id) {
      throw new CustomError(500, '无效参数');
    }

    const result = await Resource
      .findByIdAndUpdate(_id, {
        name
      }) // new: true ？？？
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    console.log('result---ActiveType', result);
    if (result) {
      ctx.data({
        data: result
      });
    } else {
      ctx.data({ code: 1001 });
    }
  }

  // 删除活动类型
  static async delete(ctx) {
    const _id = ctx.params.id;
    if (!_id) {
      throw new CustomError(500, '无效参数');
    }
    const result = await Resource
      .findByIdAndRemove(_id)
      .catch(() => {
        throw new CustomError(500, '服务器内部错误');
      });
    if (result) {
      ctx.data({
        data: result
      });
    } else {
      ctx.data({ code: 1001 });
    }
  }

  static async upload(ctx) {
    // const { filename } = ctx.req.file;
    // console.log('ctx---upload', ctx.request.body);
    console.log('ctx---upload--req', ctx.request.files);
    const { name } = ctx.request.body;
    const { files: { file } } = ctx.request;
    // const result = upload2(ctx);
    const path = `${baseUploadUrl}${file.name}`;
    const {
      userId
    } = await getUserInfo(ctx);
    const result = await new Resource({
      userId,
      name,
      url: path
    }).save();

    ctx.data({
      data: result
    });
  }
}

module.exports = resourceController;
