const getDetail = require("./api.js");
const setScript = require("./setScript.js");
const user = require("./user.js");
const other = require("./other.js");

/**
 * 只做
 * 转发接口
 * http://api.pingcc.cn/
 *
 */
module.exports = {
    ...getDetail,
    ...setScript,
    ...user,
    ...other,
};