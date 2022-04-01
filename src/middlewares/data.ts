import { Context, Next } from 'koa';
export default async (ctx:Context, next:Next) => {
  ctx.data = function ({ data = {}, code = 0, msg = 'ok' }) {
    ctx.body = {
      code: code || 0,
      msg: msg || 'ok',
      data: data || {}
    };
  };
  await next();
};
