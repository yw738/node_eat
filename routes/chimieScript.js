/**
 * Created by 杨非凡
 */
const express = require("express");
const addScript = require("../controller/chimie/addScript.js");
const Route = express.Router();

Route.route("/sApi/cmGetUpList").get(addScript.cmGetUpList);
Route.route("/sApi/getAllVideoList").get(addScript.getAllVideoList);
Route.route("/sApi/getAllshopList").get(addScript.getAllshopList);
Route.route("/sApi/addUpShop").get(addScript.addUpShop);
Route.route("/sApi/addAllUpShop").get(addScript.addAllUpShop);

module.exports = Route;
