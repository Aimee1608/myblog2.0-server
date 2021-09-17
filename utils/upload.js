const path = require('path');
const fs = require('fs');
const md5 = require('md5');
const Moment = require('moment');

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

module.exports.getTimeDir = () => {
  const time = Moment().format('YYYY-MM-DD');
  const dir = path.resolve('../public/resources', time);
  return dir;
};

module.exports.getDir = () => {
  const dir = path.resolve(__dirname, '../public/resources');
  return dir;
};
