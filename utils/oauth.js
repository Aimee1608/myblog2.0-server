const request = require('request');
const axios = require('axios');
const {
  githubOAth
} = require('../config');

const proxy = 'http://127.0.0.1:1087';
module.exports.getAccessToken = (code) => new Promise((resolve) => {
  // console.log('result---', 9999);
  const body = {
    client_id: githubOAth.client_id,
    client_secret: githubOAth.client_secret,
    code
    // redirect_uri: githubOAth.redirect_uri
  };
  // const res = await axios({
  //   url: githubOAth.url,
  //   method: 'POST',
  //   proxy: {
  //     host: '127.0.0.1',
  //     port: 4780
  //   },
  //   headers: {
  //     'content-type': 'application/json',
  //     Accept: 'application/json'
  //   }
  // })
  // console.log('res', res)
  // resolve(res.data)
  request({
    url: githubOAth.url,
    method: 'POST',
    json: true,
    body,
    // proxy,
    // strictSSL: false,
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json'
    }
  }, (error, res, data) => {
    console.log('data', data, error);
    try {
      // const result = data;
      if (data && !data.error) {
        resolve(data);
      } else {
        resolve(false);
      }
    } catch (err) {
      resolve(false);
    }
  });
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
    console.log('res----', res);
    if (res.data && !res.data.error) {
      resolve(res.data);
    } else {
      resolve(false);
    }
    // request({
    //   method: 'GET',
    //   url: githubOAth.userUrl,
    //   // proxy,
    //   // strictSSL: false,
    //   headers: {
    //     'Authorization': `Bearer ${access_token}`
    //   }
    // }, (error, res, data) => {
    //   console.log('data--user', data, error)
    //   try {
    //     if (data && !data.error) {
    //       resolve(data);
    //     } else {
    //       resolve(false)
    //     }
    //   } catch (err) {
    //     resolve(false)
    //   }
    // })
  });
};
