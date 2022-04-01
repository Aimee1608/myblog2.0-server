import {Context} from 'koa';
import jwt from 'jsonwebtoken'
import baseConfig from '../config'
import constants from './constants'
import { CustomError } from './customError'
import {DecodeUserType, UserTokenType, JwtConfigType, ErrorType} from './../types/base'
const { jwt: config }:{jwt:JwtConfigType} = baseConfig

export const createToken = ({ _id, userId }:UserTokenType):string => {
  const token = jwt.sign(
    {
      _id,
      userId
    },
    config.tokenSecret,
    {
      expiresIn: config.expiresIn
    }
  )
  return token
}

export const decodeToken = (ctx:Context) => {
  const token = ctx.cookies.get(config.tokenName)||''
  // console.log('decodeToken', token);
  const userObj:DecodeUserType|null = jwt.decode(token, {json: true})
  return userObj
}

export const checkToken = async (ctx:Context, next:() => Promise<any>) => {
  // console.log(ctx.request.body);
  const token = ctx.cookies.get(config.tokenName)
  if (token) {
    try {
      jwt.verify(token, config.tokenSecret)
      console.log('token有效===')
    } catch (error) {
      console.log('error', error)
      ctx.status = constants.HTTP_CODE.UNAUTHORIZED
      ctx.body = 'token 过期'
    }
    if (ctx.status === constants.HTTP_CODE.UNAUTHORIZED) {
      return
    }
    try {
      await next()
    } catch (error:any) {
      console.log('error===', error)
      if(typeof error == 'object' && error !=null){
        throw new CustomError(error.code, error.msg)
      }
    }
  } else {
    ctx.status = constants.HTTP_CODE.UNAUTHORIZED
    ctx.body = '无 token，请登录'
  }
}

// 清除token
export const deleteTokenCookie = (ctx:Context) => {
  // const token = ctx.cookies.get(config.tokenName);
  ctx.cookies.set(
    config.tokenName, // name
    '', // value
    {
      maxAge: 0, // cookie有效时
      httpOnly: false,
      domain: '.mangoya.cn'
    }
  )
}

export const setTokenCookie = (ctx:Context, token:string) => {
  // domain：写入cookie所在的域名
  // path：写入cookie所在的路径
  // maxAge：Cookie最大有效时长
  // expires：cookie失效时间
  // httpOnly:是否只用http请求中获得
  // overwirte：是否允许重写
  ctx.cookies.set(
    config.tokenName, // name
    token, // value
    {
      maxAge: 10 * 24 * 60 * 60 * 1000, // cookie有效时
      httpOnly: false,
      // overwirte: false,
      domain: '.mangoya.cn'
    }
  )
  // console.log('ctx.cookies', ctx.cookies.get(config.tokenName));
}
