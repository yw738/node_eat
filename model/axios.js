const request = require("request");

/**
 * 封装的请求
 * 对URL的接口进行转发
 * @param {string} url 请求路径
 * @param {string} method 请求类型
 * @param {object} params 请求参数
 */
const axios = ({ url, method = "GET", params = {}, headers = {} }) => {
  return new Promise((resolve, reject) => {
    try {
      request(
        {
          url: url,
          method: method, //请求方式，默认为get
          headers: {
            "content-type": "application/json", //设置请求头
            ...headers,
          },
          body: JSON.stringify(params), //post参数字符串
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            if (body) {
              resolve(JSON.parse(body));
            } else {
              resolve(body);
            }
          } else {
            resolve({ success: false, msg: "报错了！" });
          }
        }
      );
    } catch (err) {
      resolve({ success: false, msg: "报错了！" });
    }
  });
};

module.exports = axios;
