const multer = require('koa-multer');
// 配置
const storage = multer.diskStorage({
  // 文件保存路径
  destination(req, file, cb) {
    cb(null, 'public/uploads/'); // 注意路径必须存在
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
