import * as mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
// github
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
//  微博
// {
//   "id": 1404376560,
//   "screen_name": "zaku",
//   "name": "zaku",
//   "province": "11",
//   "city": "5",
//   "location": "北京 朝阳区",
//   "description": "人生五十年，乃如梦如幻；有生斯有死，壮士复何憾。",
//   "url": "http://blog.sina.com.cn/zaku",
//   "profile_image_url": "http://tp1.sinaimg.cn/1404376560/50/0/1",
//   "domain": "zaku",
//   "gender": "m",
//   "followers_count": 1204,
//   "friends_count": 447,
//   "statuses_count": 2908,
//   "favourites_count": 0,
//   "created_at": "Fri Aug 28 00:00:00 +0800 2009",
//   "following": false,
//   "allow_all_act_msg": false,
//   "geo_enabled": true,
//   "verified": false,
//   "status": {
//       "created_at": "Tue May 24 18:04:53 +0800 2011",
//       "id": 11142488790,
//       "text": "我的相机到了。",
//       "source": "<a href="http://weibo.com" rel="nofollow">新浪微博</a>",
//       "favorited": false,
//       "truncated": false,
//       "in_reply_to_status_id": "",
//       "in_reply_to_user_id": "",
//       "in_reply_to_screen_name": "",
//       "geo": null,
//       "mid": "5610221544300749636",
//       "annotations": [],
//       "reposts_count": 5,
//       "comments_count": 8
//   },
//   "allow_all_comment": true,
//   "avatar_large": "http://tp1.sinaimg.cn/1404376560/180/0/1",
//   "verified_reason": "",
//   "follow_me": false,
//   "online_status": 0,
//   "bi_followers_count": 215
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
  webBlogState: {
    type: Number,
    required: false,
    default: 0 // 0 不推送  1推送
  },
  label: {
    type: String,
    required: false
  },
  origin: {
    type: String,
    required: false
  },
  // 发布日期
  createDate: {
    type: Date,
    default: Date.now
  },
  // 最后修改日期
  lastModifiedDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    required: true,
    default: 3
  } // 用户权限 3为普通用户 2为管理员 1为超级管理员
})
userSchema.plugin(mongoosePaginate)
// mongoose 会自动把表名变成复数
// 想要指定collection的名称，需要设置第三个参数
// mongoose.model 执行在数据库创建表的操作
const model = mongoose.model('user', userSchema, 'user')
export default model
