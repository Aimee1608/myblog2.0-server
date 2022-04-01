import {Context} from 'koa';
import { getAccessToken, getUserInfo } from '../utils/oauth'
import constants  from '../utils/constants'
import { createToken, setTokenCookie, deleteTokenCookie, decodeToken } from '../utils/token'
import { CustomError }from '../utils/customError'
import config from '../config'
import  User from '../model/user'
import { getUserLabel, isAdminUser } from '../utils/user'
import {UserInfoType, DecodeUserType, UserQueryType} from './../types/base'


class authController {
  static async login(ctx:Context) {
    let { code, state = '' } = ctx.query
    let type = constants.GITHUB
    if (state && typeof state === 'string' && state.substring(0, 6) === 'weibo_') {
      type = constants.WEIBO
      state = state.substring(6)
    }
    console.log('code----', code, state, type)
    if(!Array.isArray(code) && code){
      const token = await getAccessToken(code, type)
      console.log('token', token)
    if (token) {
      const userInfo = await getUserInfo(token, type)
      console.log('userInfo', userInfo)
      if (userInfo) {
        const { userId, username, avatar, email, bio, blog } = userInfo
        const hasUser:UserInfoType|null = await User.findOneAndUpdate(
          {
            userId
          },
          {
            avatar,
            blog,
            bio,
            lastLoginDate: Date.now()
          }
        )
        let res:UserInfoType|null
        if (hasUser) {
          res = hasUser
        } else {
          res = await new User({
            userId,
            username,
            avatar,
            email,
            bio,
            blog,
            webBlogName: `${username}的blog`,
            webBlog: blog,
            webBlogIcon: avatar,
            webBlogDesc: bio,
            webBlogState: 0,
            status: 3,
            origin: type,
            label: getUserLabel()
          }).save()
        }
        // console.log('res---', res);
        if (res!==null && res.userId) {
          const jwtToken = createToken({
            _id: res._id,
            userId: res.userId
          })
          setTokenCookie(ctx, jwtToken)
          if (state === 'admin') {
            ctx.redirect(config.githubOAuth.redirect_admin)
          } else if (state === 'blog') {
            ctx.redirect(config.githubOAuth.redirect_uri)
          } else {
            ctx.data({
              code: constants.HTTP_CODE.UNAUTHORIZED,
              msg: '未知站点'
            })
          }
          return
        }
      }
    }
  }
    ctx.data({
      code: constants.HTTP_CODE.UNAUTHORIZED,
      msg: '登录失败'
    })
  }

  static logout(ctx:Context) {
    deleteTokenCookie(ctx)
    ctx.data({})
  }

  static async getUserInfo(ctx:Context) {
    const userObj:DecodeUserType|null = decodeToken(ctx);

    console.log('userObj', userObj)
    const result:UserInfoType|null = await User.findOne({
      _id: userObj && userObj.userId ? userObj._id:''
    })
      .exec()
      .catch(() => {
        throw new CustomError(500, '服务器内部错误')
      })
    // console.log('result', result);
    if (result) {
      const { _id, userId, username, status, avatar, webBlogName, webBlog, webBlogIcon, webBlogDesc, webBlogState, label } = result
      ctx.data({
        msg: '获取用户信息成功！',
        data: {
          _id,
          userId,
          username,
          status,
          avatar,
          webBlogName,
          webBlog,
          webBlogIcon,
          webBlogDesc,
          webBlogState,
          label
        }
      })
    } else {
      ctx.data({
        code: 1001,
        msg: '获取用户信息失败！'
      })
    }
  }

  // 获取用户列表分页
  static async getList(ctx:Context) {
    const { currentPage = 1, pageSize = 10, keywords = '' } = ctx.query

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
    }
    // 参数
    const querys:UserQueryType = {}
    if (typeof keywords === 'string' && keywords) {
      querys.$or = [
        {
          username: {
            $regex: keywords
          }
        },
        {
          userId: {
            $regex: keywords
          }
        }
      ]
    }
    // 查询
    const result = await User.paginate(querys, options)
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
      })
    } else {
      ctx.data({
        code: 1001,
        msg: '获取列表数据失败'
      })
    }
  }

  static async edit(ctx:Context) {
    const { _id, webBlogName, webBlog, webBlogIcon, webBlogDesc, webBlogState, label } = ctx.request.body
    const res:UserInfoType|null = await User.findOneAndUpdate(
      { _id },
      {
        webBlogName,
        webBlog,
        webBlogIcon,
        webBlogDesc,
        webBlogState,
        label,
        lastModifiedDate: Date.now()
      }
    )
    console.log('res--', res)
    if(res){
      ctx.data({
        data: {
          _id,
          userId: res.userId,
          username: res.username,
          status: res.status,
          avatar: res.avatar,
          webBlogName,
          webBlog,
          webBlogIcon,
          webBlogDesc,
          webBlogState,
          label
        }
      })
    } 
  }

  static async editRole(ctx:Context) {
    const { _id, status } = ctx.request.body

    await isAdminUser(ctx)

    const res = await User.findOneAndUpdate({ _id }, { status })
    console.log('res---', res)
    ctx.data({
      data: res
    })
  }

  static async getWebBlogUser(ctx:Context) {
    const res = await User.find(
      { webBlogState: 1 },
      {
        avatar: 1,
        username: 1,
        userId: 1,
        webBlogName: 1,
        webBlog: 1,
        webBlogIcon: 1,
        webBlogDesc: 1,
        webBlogState: 1
      }
    )
    ctx.data({ data: res })
  }
}

export default authController
