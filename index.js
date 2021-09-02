const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const static = require('koa-static');
const config = require('./config');
const router = require('./router');
const mongodb = require('./mongodb');
const corsOpt = require('./middlewares/corsOpt');
const data = require('./middlewares/data');
const catchError = require('./middlewares/catch');


const app = new Koa();
// 连接数据库
mongodb();


// 处理cors中间件
app.use(corsOpt);

app.use(data);
app.use(static(
  path.join(__dirname, 'public')
))
app.use(bodyParser());
// 默认控制台输出logger
app.use(logger());

app.use(catchError);

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port);
