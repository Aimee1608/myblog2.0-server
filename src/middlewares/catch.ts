import { Context, Next } from 'koa';
import {
  CustomError,
  HttpError
} from '../utils/customError'

export default async (ctx:Context, next:Next) => (
  next().catch((err) => {
    let code = 500;
    let msg = 'unknown error';
    if (err instanceof CustomError || err instanceof HttpError) {
      const res = err.getCodeMsg();
      ctx.status = err instanceof HttpError ? res.code : 200;
      code = res.code;
      msg = res.msg;
    } else {
      ctx.status = code;
      console.error('err', err);
    }
    ctx.body = {
      success: false,
      code,
      msg,
      data: {}
    };
  })
);
