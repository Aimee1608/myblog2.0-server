const User = require('../model/user');
const { getUserLabel } = require('../utils/user');
const mongodb = require('../mongodb');

const instance = mongodb();
const user = {
  userId: '游客',
  username: '游客',
  avatar: '',
  email: '',
  bio: '',
  blog: '',
  webBlogName: '',
  webBlog: '',
  webBlogIcon: '',
  webBlogDesc: '',
  webBlogState: 0,
  status: 3,
  label: getUserLabel()
};

async function insetUser() {
  const userInfo = await instance.models.user.findOne({ userId: '游客' });
  if (!userInfo) {
    await new User(user).save().then(() => {
      console.log('insert success');
    });
  } else {
    console.log('user is already in db');
  }
  process.exit(0);
}
insetUser();
