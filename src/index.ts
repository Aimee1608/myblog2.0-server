import Koa from 'koa' // learn: https://www.npmjs.com/package/koa
import koaBody from 'koa-body' // learn: http://www.ptbird.cn/koa-body.html
import Static from 'koa-static' // 静态文件处理模块
import logger from 'koa-logger'
import path from 'path'
import config from './config'
import router from './router'
import mongodb from './mongodb'
import corsOpt from './middlewares/corsOpt'
import data from './middlewares/data'
import catchError from './middlewares/catch'
import { getUploadFileName, checkDirExist, getDir, getTimeDir } from './utils/upload'

const App = new Koa()
// 连接数据库
mongodb()

// 处理cors中间件
App.use(corsOpt)
App.use(
  koaBody({
    multipart: true,
    // encoding: 'gzip',
    formidable: {
      uploadDir: getDir(), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      hash: 'md5',
      onFileBegin: (name, file) => {
        // 文件上传前的设置
        // console.log(`name: ${name}`);
        // console.log(file);
        const md5Name = getUploadFileName(file.name)
        const dir = getTimeDir()
        // console.log('dir', dir);
        checkDirExist(dir)
        // console.log('{file.hash', file.hash);
        if (typeof file === 'object') {
          file.name = md5Name
          file.path = `${dir}/${md5Name}`
        }
      }
    }
  })
)
App.use(data)
App.use(Static(path.resolve(__dirname, '../public')))
// 默认控制台输出logger
App.use(logger())

App.use(catchError)

App.use(router.routes()).use(router.allowedMethods())

App.listen(config.port, () => {
  console.log('服务器启动完成:' + config.port)
})
