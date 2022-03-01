// const request = require('request');
const axios = require('axios')
const constants = require('./constants')
const { githubOAuth, weiboOAuth } = require('../config')

const proxy = 'http://127.0.0.1:1087'

function getAccessTokenGithub(code) {
  return new Promise(async resolve => {
    try {
      const url = `${githubOAuth.url}?client_id=${githubOAuth.client_id}&client_secret=${githubOAuth.client_secret}&code=${code}`
      // 需要把参数通过url 设置 不知道为什么要这样，这样设置没有问题
      const res = await axios({
        url,
        method: 'POST',
        // proxy: {
        //   host: '127.0.0.1',
        //   port: 4780
        // },
        headers: {
          Accept: 'application/json'
        }
      })
      console.log('getAccessTokenGithub-res--data', res.data)
      if (res && res.data) {
        resolve(res.data)
      } else {
        resolve(false)
      }
    } catch (err) {
      console.log('getAccessToken---error', err)
      resolve(false)
    }
  })
}

function getAccessTokenWeibo(code) {
  return new Promise(async resolve => {
    try {
      const url = `${weiboOAuth.url}?client_id=${weiboOAuth.client_id}&client_secret=${weiboOAuth.client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${weiboOAuth.weibo_redirect_uri}`
      // 需要把参数通过url 设置 不知道为什么要这样，这样设置没有问题
      const res = await axios({
        url,
        method: 'POST'
      })
      console.log('getAccessTokenWeibo-res--data', res.data)
      if (res && res.data) {
        resolve(res.data)
      } else {
        resolve(false)
      }
    } catch (err) {
      console.log('getAccessToken---error', err)
      resolve(false)
    }
  })
}

module.exports.getAccessToken = async (code, type = constants.GITHUB) => {
  let result = false
  if (type === constants.GITHUB) {
    result = await getAccessTokenGithub(code)
  } else {
    result = await getAccessTokenWeibo(code)
  }
  console.log('getAccessToken-result', result)
  return result
}

function getUserInfoGithub(access_token, token_type) {
  // console.log(`${token_type} ${access_token}`)
  return new Promise(async resolve => {
    try {
      const res = await axios({
        method: 'GET',
        url: githubOAuth.userUrl,
        // proxy: {
        //   host: '127.0.0.1',
        //   port: 1086
        // },
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })

      console.log('res----', res.data)
      if (res.data && !res.data.error) {
        resolve(res.data)
      } else {
        resolve(false)
      }
    } catch (error) {
      console.log('getUserInfo-error', error)
      resolve(false)
    }
  })
}

function getUserInfoWeibo(access_token, uid) {
  console.log('getUserInfoWeibo---access_token', access_token)
  return new Promise(async resolve => {
    const url = `${weiboOAuth.userUrl}?access_token=${access_token}&uid=${uid}`
    try {
      const res = await axios({
        method: 'GET',
        url
        // proxy: {
        //   host: '127.0.0.1',
        //   port: 4780
        // },
      })

      console.log('res----getUserInfoWeibo', res.data)
      if (res.data) {
        resolve(res.data)
      } else {
        resolve(false)
      }
    } catch (error) {
      console.log('getUserInfo-error', error)
      resolve(false)
    }
  })
}

module.exports.getUserInfo = async ({ access_token, token_type, uid }, type = constants.GITHUB) => {
  console.log(`${token_type} ${access_token}`)
  let result = false
  if (type === constants.GITHUB) {
    const userInfo = await getUserInfoGithub(access_token)
    if (userInfo) {
      const { login: userId, name: username, avatar_url: avatar, email, bio, blog } = userInfo
      result = {
        userId,
        username,
        avatar,
        email,
        bio,
        blog
      }
    }
  } else {
    const userInfo = await getUserInfoWeibo(access_token, uid)
    if (userInfo) {
      const { id: userId, name: username, profile_image_url: avatar, description: bio } = userInfo
      result = {
        userId,
        username,
        avatar,
        email: '',
        bio,
        blog: ''
      }
    }
  }
  return result
}
