import {Context} from 'koa';
import { CustomError }from'./customError'
import { decodeToken } from './token'
import constants from './constants'
import User from '../model/user'
import { UserInfoType, DecodeUserType } from '../types/base';
const { USER_TAG } = constants


export const getUserInfo = async (ctx:Context):Promise<UserInfoType> => {
  const userObj:DecodeUserType|null = decodeToken(ctx)

  const isInvalid = await User.findOne({
    userId: userObj?userObj.userId:null
  })
  // console.log('isInvalid', isInvalid);
  if (!isInvalid) {
    throw new CustomError(500, '用户不存在')
  }
  return isInvalid
}

export const getUserLabel = () => {
  const index = Math.floor(Math.random() * (USER_TAG.length - 1))
  return USER_TAG[index]
}

export const isAdminUser = async (ctx:Context) => {
  const userObj:DecodeUserType|null = decodeToken(ctx)
  if(userObj){
    const isInvalid = await User.findOne({
      userId: userObj?userObj.userId:null
    })
  
    if (!isInvalid) {
      throw new CustomError(500, '用户不存在')
    }
    if (!(userObj.userId == 'Aimee1608' || userObj.userId == 2242812941)) {
      throw new CustomError(401, '无权限')
    }
    return isInvalid
  }
  return false
}

export const getLogId = (ctx:Context) => {
  const logId = ctx.cookies.get('aimee_blog_log_id')
  return logId
}
