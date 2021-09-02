const ERROR_MSG = require('./errorMsg');
const constants = require('./constants');

const {
  HTTP_CODE
} = constants;

class CustomError extends Error {
  constructor(code, msg) {
    super(code, msg);
    this.code = code;
    this.msg = msg || ERROR_MSG[code] || 'unknown error';
  }

  getCodeMsg() {
    return {
      code: this.code,
      msg: this.msg
    };
  }
}
class HttpError extends CustomError {
  constructor(code, msg) {
    super(code, msg);
    if (Object.values(HTTP_CODE).indexOf(code) < 0) {
      throw Error('not an invalid http code');
    }
  }
}

module.exports = {
  HttpError,
  CustomError
};
