const { CustomError } = require('./customError')
const { decodeToken } = require('./token')
const { USER_TAG } = require('./constants')
const User = require('../model/user')

exports.getUserInfo = async ctx => {
  const userObj = decodeToken(ctx)
  const isInvalid = await User.findOne({
    userId: userObj.userId
  })
  // console.log('isInvalid', isInvalid);
  if (!isInvalid) {
    throw new CustomError(500, '用户不存在')
  }
  return isInvalid
}

exports.getUserLabel = () => {
  const index = Math.floor(Math.random() * (USER_TAG.length - 1))
  return USER_TAG[index]
}

exports.isAdminUser = async ctx => {
  const userObj = decodeToken(ctx)
  const isInvalid = await User.findOne({
    userId: userObj.userId
  })

  if (!isInvalid) {
    throw new CustomError(500, '用户不存在')
  }
  if (userObj.userId !== 'Aimee1608') {
    throw new CustomError(401, '无权限')
  }
  return isInvalid
}

exports.getLogId = ctx => {
  const logId = ctx.cookies.get('aimee_blog_log_id')
  return logId
}
