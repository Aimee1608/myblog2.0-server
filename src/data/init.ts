import * as mongoose from 'mongoose'
import Article from '../model/article'
import ArticleCate from '../model/articleCate'
import Comment from '../model/comment'
import Love from '../model/love'
import Tags from '../model/tags'
import mongodb from '../mongodb'
import articleList from './blogData/blog'
import classList from './blogData/class'
import commentList from './blogData/comment'
import tagsList from './blogData/tags'
import loveList from './blogData/love'


const instance = mongodb();

async function inset(model:mongoose.PaginateModel<any>, list: any[]) {
  await Promise.all(list.map((item) => new Promise(async (resolve) => {
    const info = { ...item };
    if (info._id) {
      info._id = mongoose.Types.ObjectId(item._id);
    }
    const res = await new model(info).save().then(() => {
      console.log('insert success');
    });
    resolve(res);
  })));
}

async function init() {
  await inset(Article, articleList);
  await inset(ArticleCate, classList);
  await inset(Comment, commentList);
  await inset(Love, loveList);
  await inset(Tags, tagsList);
  console.log('insert success all');
  process.exit(0);
}

init();
