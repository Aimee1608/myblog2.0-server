// const request = require('request');
const axios = require('axios');
const {
  githubOAth
} = require('../config');

const proxy = 'http://127.0.0.1:1087';
module.exports.getAccessToken = (code) => new Promise(async (resolve) => {
  try {
    const url = `${githubOAth.url}?client_id=${githubOAth.client_id}&client_secret=${githubOAth.client_secret}&code=${code}`;
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
    });
    console.log('res--data', res);
    // const result = data;
    if (res && res.data) {
      resolve(res.data);
    } else {
      resolve(false);
    }
  } catch (err) {
    console.log('getAccessToken---error', err);
    resolve(false);
  }

  // console.log('res', res)
  // resolve(res.data)
  // request({
  //   url: githubOAth.url,
  //   method: 'POST',
  //   json: true,
  //   body,
  //   // proxy,
  //   // strictSSL: false,
  //   headers: {
  //     'content-type': 'application/json',
  //     Accept: 'application/json'
  //   }
  // }, (error, res, data) => {
  //   console.log('data', data, error);
  //   try {
  //     // const result = data;
  //     if (data && !data.error) {
  //       resolve(data);
  //     } else {
  //       resolve(false);
  //     }
  //   } catch (err) {
  //     resolve(false);
  //   }
  // });
});

module.exports.getUserInfo = ({ access_token, token_type }) => {
  console.log(`${token_type} ${access_token}`);
  return new Promise(async (resolve) => {
    const res = await axios({
      method: 'GET',
      url: githubOAth.userUrl,
      // proxy: {
      //   host: '127.0.0.1',
      //   port: 4780
      // },
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    try {
      console.log('res----', res.data);
      if (res.data && !res.data.error) {
        resolve(res.data);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log('getUserInfo-error', error);
      resolve(false);
    }
  });
};
