import * as path from "path";
import fs from 'fs';
import md5 from 'md5';
import Moment from 'moment';


export const getUploadFileName = (name: string) => {
  const ext = name.split('.');
  const shortName = ext.slice(0, ext.length - 1).join('');
  const timesTamp = new Date().getTime();
  const num = Math.floor(Math.random() * 10);
  const md5Name = `${shortName}-${md5(name + num + timesTamp)}.${ext[ext.length - 1]}`;
  return md5Name;
};

export const checkDirExist = (p:string) => {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
};

export const getTimeDir = () => {
  const time = Moment().format('YYYY-MM-DD');
  const dir = path.resolve('../public/resources', time);
  return dir;
};

export const getDir = () => {
  const dir = path.resolve(__dirname, '../public/resources');
  return dir;
};
