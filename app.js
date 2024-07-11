const express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
const app = express();
app.use(express.json()); //设置json解析
const opn = require("opn");
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

const forwardRouter = require("./routes/forwardRouter");
const user = require("./routes/user");
const eatApp = require("./routes/eatApp");
const chimieScript = require("./routes/chimieScript");
app.use(forwardRouter);
app.use(user);
app.use(eatApp);
app.use(chimieScript);
const path = require("path");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/file"));

/**
 * 全局变量
 */
const POST = 8081;
global.globalData = {
  local: `http://localhost:${POST}`, //本项目的ip
};

app.listen(POST, function () {
  console.log("启动成功!");
  console.log("http://localhost:" + POST);
});
