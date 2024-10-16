/**
 * 用户模块
 */
const db = require("../../utils/mysql.js");
const publicJs = require("../../utils/index.js");
const SnowflakeID = require("../../utils/snowflakeID.js");
const request = require("request");
const axios = require("./../../model/axios.js");
const jwt = require("jsonwebtoken");

// 雪花id
const snid = new SnowflakeID({
  mid: +new Date(),
});
// let id = snid.generate();
class User {
  // 获取用户openId
  getOpenId(req, res) {
    // 测试 jwt 鉴权
    // let token = jwt.sign({ id: 96110 }, global.globalData.secretKey, {
    //   expiresIn: "1H",
    // });
    // res.send({ token });
    // return;
    let { code } = req.query;
    let appId = "wx870e38a4f0ead16e";
    let secret = "19a0a6c31338e1df0cfd16e50d34d735";
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    axios({ url }).then((response) => {
      if (response) {
      }
      let token = jwt.sign(
        { id: response.openId },
        global.globalData.secretKey,
        {
          expiresIn: "1H",
        }
      );
      res.send({ token });
    });
  }

  // 查询用户信息
  getUser(req, res) {
    // console.log(req.auth);
    // let { id } = req.params;
    let { id } = req.auth;
    if (!id) {
      res.send({ code: 1, message: "没有id" });
      return;
    }
    id = id && filterSpaces(id);
    db.querySql("user", {
      user_id: id,
    }).then((result) => {
      res.send({ code: 0, data: result[0] || null });
    });
  }

  // 新增用户信息
  addUser(req, res) {
    // userId 就是 wx的openId
    let { id: userId } = req.auth;
    let { userName = "羊跑跑" } = req.body; //userId,
    if (!userId) {
      res.send({ code: 1, message: "没有id" });
      return;
    }
    userName = userName && filterSpaces(userName);
    userId = userId && filterSpaces(userId);
    let json = {
      user_id: userId,
      user_name: userName,
      createtime: publicJs.getTime(true),
      last_visit: publicJs.getTime(true),
    };
    db.add("user", json).then(() => {
      res.send({ code: 0, message: "新增成功" });
    });
  }

  // 更新用户信息 最后登录信息
  updateUser(req, res) {
    // let { userId } = req.body;
    let { id: userId } = req.auth;
    if (!userId) {
      res.send({ code: 1, message: "没有id" });
      return;
    }
    userId = userId && filterSpaces(userId);
    let json = {
      last_visit: publicJs.getTime(true),
    };
    db.update("user", json, { user_id: userId }).then(() => {
      res.send({ code: 0, message: "更新成功" });
    });
  }

  // 新增收藏
  addCollection(req, res) {
    let { videoId, num, shopId } = req.query;
    let { id: userId } = req.auth;
    let id = snid.generate();
    videoId = videoId && filterSpaces(videoId);
    num = num && filterSpaces(num);
    shopId = shopId && filterSpaces(shopId);
    userId = userId && filterSpaces(userId);
    db.add("my_collection", {
      videoId: videoId,
      userId: userId,
      shopId: shopId,
      num: num,
      id: id,
    }).then((result) => {
      res.send({ code: 0, data: { id: id }, message: "新增成功" });
    });
  }

  // 取消收藏
  delCollection(req, res) {
    let { id } = req.query;
    db.del("my_collection", {
      id: id,
    }).then((result) => {
      res.send({ code: 0, message: "删除成功" });
    });
  }

  // 获取当前用户的收藏
  getAllCollection(req, res) {
    // let { userId } = req.query;
    let { id: userId } = req.auth;
    if (!userId) return;
    userId = userId && filterSpaces(userId);
    let sql = `SELECT m.*,j.up_name FROM (SELECT d.*,e.address,e.avgPrice,e.name AS addName FROM (SELECT c.*,b.id,b.name,b.cityName,b.videoTime,b.videoTitle,b.up_id,b.videoImg FROM (SELECT a.videoId,a.shopId,a.num FROM my_collection a WHERE a.userId = '${userId}') c INNER JOIN video_list b ON c.videoId = b.videoId) d INNER JOIN shop_list e ON d.shopId = e.id
    ) m INNER JOIN up_list j ON m.up_id = j.up_id`;
    db.dbquery(sql).then((result) => {
      res.send({ code: 0, data: result, message: "ok" });
    });
  }

  // 判断 店铺是否被用户收藏
  shopIsCollection(req, res) {
    let { videoId } = req.query;
    let { id: userId } = req.auth || {};
    if (!userId) return;
    userId = userId && filterSpaces(userId);
    videoId = videoId && filterSpaces(videoId);
    let sql = `select id,shopId from my_collection where userId = '${userId}' and videoId = '${videoId}'`;
    db.dbquery(sql).then((result) => {
      let json = {};
      result.forEach((v) => (json[v.shopId] = v.id));
      res.send({ code: 0, data: json, message: "ok" });
    });
  }
}

module.exports = new User();
