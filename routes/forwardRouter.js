/**
 * Created by 杨非凡
 * 接口转发router
 */
const express = require("express");
const api = require("../controller/albion/index.js");
const Route = express.Router();

Route.route("/api/getJsonData").get(api.getJsonData);
Route.route("/api/getPrice").get(api.getPrice);
Route.route("/api/getHistory").get(api.getHistory);
Route.route("/api/getList").get(api.getList);
Route.route("/api/imgUrl").get(api.imgUrl);
Route.route("/api/downAllImg").get(api.downAllImg);


Route.route("/api/getItemData").get(api.getItemData);
Route.route("/api/getUserList").get(api.getUserList);
Route.route("/api/getUserInfo").get(api.getUserInfo);
Route.route("/api/getUserDeath").get(api.getUserDeath);
Route.route("/api/getUserKill").get(api.getUserKill);


// 处理的接口
Route.route("/api/setData").get(api.setData);
Route.route("/api/updateFileList").get(api.updateFileList);
module.exports = Route;