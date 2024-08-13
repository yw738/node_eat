/**
 * Created by 杨非凡
 */
const express = require("express");
const api = require("../controller/eatApp/index.js");
const Route = express.Router();
const BASE_API = `/api/v1`;

Route.route(`${BASE_API}/getUpList`).get(api.getUpList);
Route.route(`${BASE_API}/getList`).get(api.getList);
Route.route(`${BASE_API}/getDetail`).get(api.getDetail);
// Route.route(`${BASE_API}/cmGetUpList`).get(api.getAllVideoList);
// Route.route(`${BASE_API}/cmGetUpList`).get(api.getAllshopList);
// Route.route(`${BASE_API}/cmGetUpList`).get(api.addUpShop);
// Route.route(`${BASE_API}/cmGetUpList`).get(api.addAllUpShop);

module.exports = Route;
