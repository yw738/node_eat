const express = require("express");
const app = express();
app.use(express.json()); //设置json解析
const { expressjwt } = require("express-jwt");

const MIME = {
  js: "application/javascript",
  json: "application/json",
  html: "text/html",
  css: "text/css",
  gif: "image/gif", //图片 (无损耗压缩方面被PNG所替代)
  jpeg: "image/jpeg", //图片
  png: "image/png", //图片
  svg: "image/svg+xml", //(矢量图)
};
/**
 * express 设置全局响应头
 **/
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.type("html");
  for (let [label, value] of Object.entries(MIME)) {
    if (req.url.endsWith(label)) {
      res.header("Content-Type", value);
      break;
    }
  }
  next();
});

/**
 * 生成 token 的密钥
 */
const secretKey = "tubindaochuchixiaochengxu";
// 注意：只要配置成功了 express-jwt 这个中间件，就可以把解析出来的用户信息，挂载到 `req.user` 属性上
// app.use(
//   expressjwt({
//     secret: secretKey,
//     algorithms: ["HS256"],
//     getToken: function fromHeaderOrQuerystring(req) {
//       if (req.headers.tk && req.headers.tk.split("-")[0] === "tb") {
//         return req.headers.tk.split("-")[1];
//       }
//       return null;
//     },
//   }).unless({
//     // 除去前綴為 /sApi 的請求都有 jwt 鑒權
//     path: [/^\/sApi\//, /^\/api\//],
//   })
// );
/**
 * 全局鉴权
 */
// app.use((err, req, res, next) => {
//   // 这次错误是由 token 解析失败导致的
//   if (err.name === "UnauthorizedError") {
//     return res.send({
//       status: 401,
//       message: "无效的token",
//     });
//   }
//   res.send({
//     status: 500,
//     message: "未知的错误",
//   });
// });

/**
 * 加载api
 */
const user = require("./routes/user");
const eatApp = require("./routes/eatApp");
const chimieScript = require("./routes/chimieScript");
app.use(user);
app.use(eatApp);
app.use(chimieScript);

/**
 * 设置web 地址
 */
const path = require("path");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/file"));

/**
 * 全局变量
 */
const POST = 8081;
global.globalData = {
  local: `http://localhost:${POST}`, //本项目的ip
  secretKey,
};

app.listen(POST, function () {
  console.log("启动成功!");
  console.log(global.globalData.local);
});
