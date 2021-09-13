const Moment = require('moment');
const Comment = require('../model/comment');
const mongodb = require('../mongodb');

const instance = mongodb();

const jsonData = require('./json/comment.json');

console.log('jsonData', jsonData);
const { RECORDS } = jsonData;
// aboutme: '关于我',
// message: '留言板',
// friendlink: '友链
const defaultList = {
  1: 'reward',
  2: 'friendlink',
  3: 'message',
  4: 'aboutme'
};
async function insetComment() {
  const list = RECORDS.map((item) => new Promise((resolve) => {
    // const item = RECORDS[i];
    const { time, content, article_id } = item; // 1：赞赏 2：友情链接 3：留言板 4：关于我

    const h = time.split(' ')[1];
    const y = time.split(' ')[0].split('/');

    const t = Moment(`${y[2]}-${y[1]}-${y[0]} ${h}`);
    const info = {
      userId: '游客',
      articleId: defaultList[article_id] || 'message',
      content,
      parentId: '', // 1 开启 0 不开启
      state: 1,
      // 发布日期
      createDate: new Date(t)
    };
    resolve(new Comment(info).save().then(() => {
      console.log('insert success');
    }));
  }));
  const res = await Promise.all(list);
  console.log('res', res);
  // for (let i; i < RECORDS.length - 1; i++) {

  // }

  // process.exit(0);
}
insetComment();
