const {
  CustomError
} = require('./customError.js');
const {
  decodeToken
} = require('./token');

const User = require('../model/user');

exports.getUserInfo = async (ctx) => {
  const userObj = decodeToken(ctx);
  const isInvalid = await User.findOne({
    userId: userObj.userId
  });
  // console.log('isInvalid', isInvalid);
  if (!isInvalid) {
    throw new CustomError(500, '用户不存在');
  }
  return isInvalid;
};
