const { getAccessToken, getUserInfo } = require('../utils/oauth');
const constants = require('../utils/constants');
const {
  createToken, setTokenCookie, deleteTokenCookie, decodeToken
} = require('../utils/token');
const { CustomError } = require('../utils/customError');
const config = require('../config');
const User = require('../model/user');

class authController {
  static async login(ctx) {
    const { code } = ctx.query;
    console.log('code----', code);
    const token = await getAccessToken(code);
    console.log('token', token);
    ctx.cookies.set('id', 1);
    if (token) {
      const userInfo = await getUserInfo(token);
      console.log('userInfo', userInfo);
      if (userInfo) {
        const {
          login: userId, name: username, avatar_url: avatar, email, bio, blog
        } = userInfo;
        const hasUser = await User.findOneAndUpdate({
          userId
        }, {
          avatar,
          blog,
          bio,
          lastLoginDate: Date.now()
        });
        let res;
        if (hasUser) {
          res = hasUser;
        } else {
          res = await new User({
            userId,
            username,
            avatar,
            email,
            bio,
            blog,
            status: 3
          }).save();
        }
        console.log('res---', res);
        if (res) {
          const jwtToken = createToken({
            _id: res._id,
            userId: res.userId
          });
          setTokenCookie(ctx, jwtToken);
          ctx.redirect(config.githubOAth.redirect_uri);
          return;
        }
      }
    }
    ctx.data({
      code: constants.HTTP_CODE.UNAUTHORIZED,
      msg: '登录失败'
    });
  }

  static logout(ctx) {
    deleteTokenCookie(ctx);
    ctx.data({});
  }

  static async getUserInfo(ctx) {
    const userObj = decodeToken(ctx);
    console.log('userObj', userObj);
    const result = await User.findOne({
      _id: userObj._id
    }).exec().catch(() => {
      throw new CustomError(500, '服务器内部错误');
    });
    console.log('result', result);
    if (result) {
      const {
        _id,
        userId,
        username,
        status,
        avatar
      } = result;
      ctx.data({
        msg: '获取用户信息成功！',
        data: {
          _id,
          userId,
          username,
          status,
          avatar
        }
      });
    } else {
      ctx.data({
        code: 1001,
        msg: '获取用户信息失败！'
      });
    }
  }

  // 获取用户列表分页
  static async getList(ctx) {
    const {
      currentPage = 1, pageSize = 10, keywords = ''
    } = ctx.query;

    // 过滤条件
    const options = {
      username: {
        $regex: keywords
      },
      sort: {
        lastLoginDate: -1
      }, // 按id倒序
      page: Number(currentPage), // 当前页
      limit: Number(pageSize) // 每页数
    };
    // 参数
    const querys = {};
    if (keywords) {
      querys.$or = [{
        username: {
          $regex: keywords
        }
      },
      {
        userId: {
          $regex: keywords
        }
      }];
    }
    // 查询
    const result = await User
      .paginate(querys, options);
    if (result) {
      ctx.data({
        msg: '列表数据获取成功',
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
      ctx.data({
        code: 1001,
        msg: '获取列表数据失败'
      });
    }
  }
}

module.exports = authController;
