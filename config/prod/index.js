module.exports = {
  ip: process.env.ip,
  port: process.env.PORT || 8899, // server端口
  routerBaseApi: '/v1', // 接口基础路径
  LIMIT: 16,
  githubOAth: {
    url: 'https://github.com/login/oauth/access_token',
    client_id: '7a79cb87ff58020bc1ff',
    client_secret: 'db7a2b1e41ffc6a65f487f40e583011393b59d1e',
    redirect_uri: 'http://aimeeblog.mangoya.cn',
    redirect_admin: 'http://aimeeadmin.mangoya.cn',
    userUrl: 'https://api.github.com/user',
    login_url: 'http://aimeeserver.mangoya.cn/v1/user/login'
  },
  jwt: {
    tokenName: 'aimee-blog-token',
    tokenSecret: '123456',
    expiresIn: '240h' // 10天有效期
  },
  mongo: {
    host: '127.0.0.1',
    database: 'aimeeblog',
    port: 27017,
    user: 'aimee',
    password: 'small_root',
    rs_name: ''
  },
  baseUploadUrl: 'http://aimeeserver.mangoya.cn/resource/'
};
