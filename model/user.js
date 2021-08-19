const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
// {
//   login: 'Aimee1608',
//   id: 21167450,
//   node_id: 'MDQ6VXNlcjIxMTY3NDUw',
//   avatar_url: 'https://avatars.githubusercontent.com/u/21167450?v=4',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/Aimee1608',
//   html_url: 'https://github.com/Aimee1608',
//   followers_url: 'https://api.github.com/users/Aimee1608/followers',
//   following_url: 'https://api.github.com/users/Aimee1608/following{/other_user}',
//   gists_url: 'https://api.github.com/users/Aimee1608/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/Aimee1608/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/Aimee1608/subscriptions',
//   organizations_url: 'https://api.github.com/users/Aimee1608/orgs',
//   repos_url: 'https://api.github.com/users/Aimee1608/repos',
//   events_url: 'https://api.github.com/users/Aimee1608/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/Aimee1608/received_events',
//   type: 'User',
//   site_admin: false,
//   name: 'Aimee',
//   company: null,
//   blog: 'http://mangoya.cn/',
//   location: null,
//   email: 'shuigongqian@sina.com',
//   hireable: true,
//   bio: 'Write the Code. Change the World.',
//   twitter_username: null,
//   public_repos: 53,
//   public_gists: 0,
//   followers: 102,
//   following: 1,
//   created_at: '2016-08-22T06:07:35Z',
//   updated_at: '2021-07-27T14:30:13Z'
// }
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  blog: {
    type: String,
    required: false
  },
  webBlogName: {
    type: String,
    required: false
  },
  webBlog: {
    type: String,
    required: false
  },
  webBlogIcon: {
    type: String,
    required: false
  },
  webBlogDesc: {
    type: String,
    required: false
  },
  label: {
    type: String,
    required: false
  },
  // 发布日期
  createDate: {
    type: Date,
    default: Date.now()
  },
  // 最后修改日期
  lastModifiedDate: {
    type: Date,
    default: Date.now()
  },
  lastLoginDate: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: Number,
    required: true,
    default: 3
  } // 用户权限 3为普通用户 2为管理员 1为超级管理员
});
userSchema.plugin(mongoosePaginate);
// mongoose 会自动把表名变成复数
// 想要指定collection的名称，需要设置第三个参数
// mongoose.model 执行在数据库创建表的操作
module.exports = mongoose.model('user', userSchema, 'user');
