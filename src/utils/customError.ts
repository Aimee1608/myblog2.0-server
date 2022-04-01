import ERROR_MSG from './errorMsg'
import constants from './constants'
const {
  HTTP_CODE
} = constants;

class CustomError extends Error {
  code
  msg
  constructor(code: number, msg: string) {
    super(code+'');
    this.code = code;
    this.msg = msg || Reflect.get(ERROR_MSG,code) || 'unknown error';
  }

  getCodeMsg() {
    return {
      code: this.code,
      msg: this.msg
    };
  }
}
class HttpError extends CustomError {
  constructor(code: number, msg: string) {
    super(code, msg);
    if (Object.values(HTTP_CODE).indexOf(code) < 0) {
      throw Error('not an invalid http code');
    }
  }
}

export {
  HttpError,
  CustomError
};
