const Moment = require('moment');
/**
 * @desc 检查是否为空对象
 */
exports.isEmptyObject = (obj) => Object.keys(obj).length === 0;

/**
 * @desc 常规正则校验表达式
 */
exports.validatorsExp = {
  number: /^[0-9]*$/,
  numberAndCharacter: /^[0-9a-zA-Z]+$/,
  nameLength: (n) => new RegExp(`^[\\u4E00-\\u9FA5]{${n},}$`),
  idCard: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
  backCard: /^([1-9]{1})(\d{15}|\d{18})$/,
  phone: /^1[3456789]\d{9}$/,
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
};

/**
 * @desc 常规正则校验方法
 */
exports.validatorsFun = {
  number: (val) => exports.validatorsExp.number.test(val),
  numberAndCharacter: (val) => exports.validatorsExp.numberAndCharacter.test(val),
  idCard: (val) => exports.validatorsExp.idCard.test(val),
  backCard: (val) => exports.validatorsExp.backCard.test(val)
};

exports.isValidObjectId = (str) => {
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
  return checkForHexRegExp.test(str);
};

exports.groupChunk = (array, subGroupLength) => {
  let index = 0;
  const newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
};

const flatten = (arr) => (
  arr.reduce((result, item) => result.concat(Array.isArray(item) ? flatten(item) : item), [])
);
exports.flatten = flatten;
