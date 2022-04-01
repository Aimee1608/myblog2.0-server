import Moment from 'moment'
import {ArticleInfoType, ArticleTimeObjType, ArticleTimeType} from './../types/base'
/**
 * @desc 检查是否为空对象
 */
export const isEmptyObject = (obj:any) => Object.keys(obj).length === 0

/**
 * @desc 常规正则校验表达式
 */
export const validatorsExp = {
  number: /^[0-9]*$/,
  numberAndCharacter: /^[0-9a-zA-Z]+$/,
  nameLength: (n:any) => new RegExp(`^[\\u4E00-\\u9FA5]{${n},}$`),
  idCard: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
  backCard: /^([1-9]{1})(\d{15}|\d{18})$/,
  phone: /^1[3456789]\d{9}$/,
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
}

/**
 * @desc 常规正则校验方法
 */
export const validatorsFun = {
  number: (val:any) => validatorsExp.number.test(val),
  numberAndCharacter: (val:any) => validatorsExp.numberAndCharacter.test(val),
  idCard: (val:any) => validatorsExp.idCard.test(val),
  backCard: (val:any) => validatorsExp.backCard.test(val)
}

export const isValidObjectId = (str:string) => {
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')
  return checkForHexRegExp.test(str)
}

export const groupChunk = (array:[], subGroupLength: number) => {
  let index = 0
  const newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }
  return newArray
}

export const flatten = (arr:any[]):any[] => arr.reduce((result, item) => result.concat(Array.isArray(item) ? flatten(item) : item), [])


export const getArticleTime = (arr:ArticleInfoType[]):ArticleTimeType[] => {
  const Obj:ArticleTimeObjType = {}
  arr.forEach(item => {
    const year = Moment(item.createDate).format('YYYY')
    if (Obj[year]) {
      Obj[year].push(item)
    } else {
      Obj[year] = [item]
    }
  })
  const list = Object.keys(Obj).map(item => ({ year: item, list: Obj[item] }))
  list.sort((a, b) => Number(b.year) - Number(a.year))
  return list
}
