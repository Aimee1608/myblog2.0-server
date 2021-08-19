const jwt = require('jsonwebtoken');
const {
  jwt: config
} = require('../config');
const constants = require('./constants');
const {
  CustomError
} = require('./customError');

module.exports.createToken = ({
  _id,
  userId
}) => {
  const token = jwt.sign({
    _id,
    userId
  }, config.tokenSecret, {
    expiresIn: config.expiresIn
  });
  return token;
};

module.exports.decodeToken = (ctx) => {
  const token = ctx.cookies.get(config.tokenName);
  // console.log('decodeToken', token);
  const userObj = jwt.decode(token, config.tokenSecret);
  return userObj;
};

module.exports.checkToken = async (ctx, next) => {
  // console.log(ctx.request.body);
  const token = ctx.cookies.get(config.tokenName);
  if (token) {
    try {
      jwt.verify(token, config.tokenSecret);
      console.log('token有效===');
    } catch (error) {
      console.log('error', error);
      ctx.status = constants.HTTP_CODE.UNAUTHORIZED;
      ctx.body = 'token 过期';
    }
    if (ctx.status === constants.HTTP_CODE.UNAUTHORIZED) {
      return;
    }
    try {
      await next();
    } catch (error) {
      console.log('error===', error);
      throw new CustomError(error.code, error.msg);
    }
  } else {
    ctx.status = constants.HTTP_CODE.UNAUTHORIZED;
    ctx.body = '无 token，请登录';
  }
};

// 清除token
module.exports.deleteTokenCookie = (ctx) => {
  // const token = ctx.cookies.get(config.tokenName);
  ctx.cookies.set(
    config.tokenName, // name
    '', // value
    {
      maxAge: 0, // cookie有效时
      httpOnly: false
    }
  );
};

module.exports.setTokenCookie = (ctx, token) => {
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
      overwirte: false
    }
  );
  // console.log('ctx.cookies', ctx.cookies.get(config.tokenName));
};
