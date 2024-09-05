/**
 * 用户模块
 */
const db = require("../../utils/mysql.js");
const publicJs = require("../../utils/index.js");
const SnowflakeID = require("../../utils/snowflakeID.js");
const request = require("request");
const axios = require("./../../model/axios.js");

// 雪花id
const snid = new SnowflakeID({
  mid: +new Date(),
});
// let id = snid.generate();
class User {
  // 获取用户openId
  getOpenId(req, res) {
    let { code } = req.query;
    let appId = "wxa5e5a9a17ed70a29";
    let secret = "a971ec96643d4cb0e0aa2f67be7bedfd";
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    axios({ url }).then((response) => {
      res.send(response);
    });
  }

  // 查询用户信息
  getUser(req, res) {
    let { id } = req.params;
    if (!id) {
      res.send({ code: 1, message: "没有id" });
      return;
    }
    db.querySql("user", {
      user_id: id,
    }).then((result) => {
      res.send({ code: 0, data: result[0] || null });
    });
  }

  // 新增用户信息
  addUser(req, res) {
    let { userId, userName = "羊跑跑" } = req.body;
    if (!userId) {
      res.send({ code: 1, message: "没有id" });
      return;
    }
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
    let { userId } = req.body;
    if (!userId) {
      res.send({ code: 1, message: "没有id" });
      return;
    }

    let json = {
      last_visit: publicJs.getTime(true),
    };
    db.update("user", json, { user_id: userId }).then(() => {
      res.send({ code: 0, message: "更新成功" });
    });
  }

  // 新增收藏
  addCollection(req, res) {
    let { videoId, userId, num, shopId } = req.query;
    let id = snid.generate();
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
    let { userId } = req.query;
    let sql = `SELECT d.*,e.address,e.avgPrice,e.name AS addName FROM (SELECT c.*,b.name,b.cityName,b.videoTime FROM (SELECT * FROM my_collection a WHERE a.userId = '${userId}')
    c INNER JOIN video_list b ON c.videoId = b.id) d INNER JOIN shop_list e ON d.shopId = e.id`;
    db.dbquery(sql).then((result) => {
      res.send({ code: 0, data: result, message: "ok" });
    });
    // db.querySql("my_collection", {
    //   userId: userId,
    // }).then((result) => {
    //   let arr = result.map((v) => ({
    //     id: v.id,
    //     video_id: v.video_id,
    //   }));
    //   res.send({ code: 0, data: arr, message: "成功" });
    // });
  }
}

module.exports = new User();
