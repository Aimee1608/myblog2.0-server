const Koa = require('koa');
// const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const Static = require('koa-static');
const koaBody = require('koa-body');
const path = require('path');
const config = require('./config');
const router = require('./router');
const mongodb = require('./mongodb');
const corsOpt = require('./middlewares/corsOpt');
const data = require('./middlewares/data');
const catchError = require('./middlewares/catch');
const { getUploadFileName, checkDirExist } = require('./utils/upload');

const app = new Koa();
// 连接数据库
mongodb();

// 处理cors中间件
app.use(corsOpt);
app.use(koaBody({
  multipart: true,
  // encoding: 'gzip',
  formidable: {
    uploadDir: path.join(__dirname, 'public/resources'), // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    hash: 'md5',
    onFileBegin: (name, file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
      const md5Name = getUploadFileName(file.name);
      const dir = path.join(__dirname, 'public/resources');
      checkDirExist(dir);
      // console.log('{file.hash', file.hash);
      file.name = md5Name;
      file.path = `${dir}/${md5Name}`;
    },
    onError: (error) => {
      console.log('error', error);
    }
  }
}));
app.use(data);
app.use(Static(
  path.join(__dirname, 'public')
));
// app.use(bodyParser());
// 默认控制台输出logger
app.use(logger());

app.use(catchError);

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port);
