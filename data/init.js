const mongoose = require('mongoose');
const Article = require('../model/article');
const ArticleCate = require('../model/articleCate');
const Comment = require('../model/comment');
const Love = require('../model/love');
const Tags = require('../model/tags');
const mongodb = require('../mongodb');
const articleList = require('./blogData/blog');
const classList = require('./blogData/class');
const commentList = require('./blogData/comment');
const tagsList = require('./blogData/tags');
const loveList = require('./blogData/love');

const instance = mongodb();

async function inset(Model, list) {
  await Promise.all(list.map((item) => new Promise(async (resolve) => {
    const info = { ...item };
    if (info._id) {
      info._id = mongoose.Types.ObjectId(item._id);
    }
    const res = await new Model(info).save().then(() => {
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
