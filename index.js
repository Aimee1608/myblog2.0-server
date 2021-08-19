const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const config = require('./config');
const router = require('./router');
const mongodb = require('./mongodb');
const corsOpt = require('./middlewares/corsOpt');
const data = require('./middlewares/data');

const app = new Koa();
// 连接数据库
mongodb();

// 处理cors中间件
app.use(corsOpt);

app.use(corsOpt);

app.use(data);

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port);
