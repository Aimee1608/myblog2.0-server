const config = {
  ip: process.env.ip,
  port: process.env.PORT || 8899, // server端口
  routerBaseApi: '/v1', // 接口基础路径
  LIMIT: 16,
  githubOAuth: {
    url: 'https://github.com/login/oauth/access_token',
    client_id: '7a79cb87ff58020bc1ff',
    client_secret: 'db7a2b1e41ffc6a65f487f40e583011393b59d1e',
    redirect_uri: 'https://mangoya.cn',
    redirect_admin: 'https://mangoya.cn/admin2.0/',
    userUrl: 'https://api.github.com/user',
    login_url: 'https://mangoya.cn/v1/user/login'
  },
  weiboOAuth: {
    url: 'https://api.weibo.com/oauth2/access_token',
    weibo_redirect_uri: 'https://mangoya.cn/v1/user/login',
    redirect_uri: 'https://mangoya.cn',
    redirect_admin: 'https://mangoya.cn/admin2.0/',
    client_id: '1075586328',
    client_secret: '786dc59110b6e950a974d8ebdd5bfe5f',
    userUrl: 'https://api.weibo.com/2/users/show.json'
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
  baseUploadUrl: 'https://mangoya.cn/v1/resources/'
}
export default config
