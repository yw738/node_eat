const CryptoJS = require("crypto-js"); //引入加密库
window = this;
// const JSEncrypt = require("jsencrypt");

/**
 * 吃咩 解密
 * chimie 的解密秘钥 放在小程序内部的 需要解包去拿
 */
function r(e) {
  var n = CryptoJS.enc.Utf8.parse("0000000000000000"),
    o = CryptoJS.enc.Base64.parse(
      "G2aqtcn4b+MWhvCqflPJb4iaoCGX5HBPGflFtOCKd+k="
    ),
    a = CryptoJS.algo.AES.createDecryptor(o, {
      iv: n,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
      .finalize(CryptoJS.enc.Base64.parse(e))
      .toString(CryptoJS.enc.Utf8);
  return JSON.parse(a);
}

// https://chimie.fun/vsd/index/userConfig/getAllMenuType

module.exports = r;
