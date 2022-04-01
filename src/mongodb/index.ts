// mongoose数据库模块

import mongoose from 'mongoose'
import config from '../config'
import { MongodbConfigType } from '../types/base';
const {mongo} = config;
const getUrl = (config:MongodbConfigType):string => {
  const {
    user, password, host, port, database
  } = config;
  let mongoUrl = 'mongodb://';
  if (user) {
    mongoUrl += `${user}:${password}@`;
  }
  mongoUrl += `${host}:${port}/${database}`;
  return mongoUrl;
};

// mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
const mongodb = ():mongoose.Mongoose => {
  const mongoUrl = getUrl(mongo);
  console.log('mongoUrl', mongoUrl);
  // 连接数据库
  // 新版mongodb连接数据库要加{ useNewUrlParser:true }
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  // 连接错误处理
  db.on('error', (err) => {
    console.log('数据库连接出错！');
    console.log('err', err);
  });
  // 连接成功处理
  db.once('open', () => {
    console.log('数据库连接成功！');
  });

  return mongoose;
};
export default mongodb;
