/**
 * Created by 杨非凡
 */
const express = require("express");
const addScript = require("../controller/chimie/addScript.js");
const Route = express.Router();

Route.route("/api/cmGetUpList").get(addScript.cmGetUpList);
Route.route("/api/getAllVideoList").get(addScript.getAllVideoList);
Route.route("/api/getAllshopList").get(addScript.getAllshopList);
Route.route("/api/addUpShop").get(addScript.addUpShop);
Route.route("/api/addAllUpShop").get(addScript.addAllUpShop);

module.exports = Route;
