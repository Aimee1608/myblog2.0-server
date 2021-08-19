module.exports = {
  ip: process.env.ip,
  port: process.env.PORT || 8999, // server端口
  routerBaseApi: '/v1', // 接口基础路径
  LIMIT: 16,
  githubOAth: {
    url: 'https://github.com/login/oauth/access_token',
    client_id: '7dd33c1a56813db7f797',
    client_secret: 'de51eecf4d0b887ee9ddbe13019d664d09a6150f',
    redirect_uri: 'http://localhost:8080',
    userUrl: 'https://api.github.com/user'
  },
  jwt: {
    tokenName: 'aimee-test-token',
    tokenSecret: '123456',
    expiresIn: '240h' // 10天有效期
  },
  mongo: {
    host: '127.0.0.1',
    database: 'aimeeTest',
    port: 27037,
    user: '',
    password: '',
    rs_name: ''
  }
};
