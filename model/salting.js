/**
 * 加密算法
 */
var CryptoJS = require("crypto-js");
let secretKey = `secret key 123`;

/**
 * 加密方法 Encrypt
 */
let encryptFn = (data) => {
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return ciphertext;
};

/**
 * 解密方法 Decrypt
 */
let decryptFn = (ciphertext) => {
  var bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //   console.log(decryptedData); //输出 [{id: 1}, {id: 2}]
  return decryptedData;
};

module.exports = {
  encryptFn,
  decryptFn,
};
