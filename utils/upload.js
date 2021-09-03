const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');

const commonPath = 'public/resource/';
// 配置
const storage = multer.diskStorage({
  // 文件保存路径
  destination(req, file, cb) {
    cb(null, 'public/resource/'); // 注意路径必须存在
  },
  // 修改文件名称
  filename(req, file, cb) {
    const fileFormat = (file.originalname).split('.');
    cb(null, `${Date.now()}.${fileFormat[fileFormat.length - 1]}`);
  }
});

// 加载配置
const upload = multer({ storage });
module.exports.upload = upload;

module.exports.upload2 = (ctx) => {
  const fileName = ctx.request.body.name;
  const { file } = ctx.request.files;
  // 创建可读流
  const render = fs.createReadStream(file.path);
  const filePath = path.join(commonPath, `${fileName}.${file.name.split('.').pop()}`);
  const fileDir = path.join(commonPath);
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, (err) => {
      console.log(err);
      console.log('创建失败');
    });
  }
  // 创建写入流
  const upStream = fs.createWriteStream(filePath);
  render.pipe(upStream);
  return { fileName };
};

module.exports.getUploadFileName = (name) => {
  const ext = name.split('.');
  const shortName = ext.slice(0, ext.length - 1).join('');
  const timesTamp = new Date().getTime();
  const num = Math.floor(Math.random() * 10);
  const md5Name = `${shortName}-${md5(name + num + timesTamp)}.${ext[ext.length - 1]}`;
  return md5Name;
};

module.exports.checkDirExist = (p) => {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
};
