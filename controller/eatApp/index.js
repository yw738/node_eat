/**
 * 用户
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
class App {
  /**
   * 查询 up 列表
   */
  getUpList(req, res) {
    db.selectAll("up_list").then(async (result) => {
      res.send({ success: true, data: result, message: "成功" });
    });
  }

  //
  getList(req, res) {
    let {
      pageSize = 20,
      pageIndex = 1,
      upId = "",
      city = "",
      keyword = "",
      foodType = "",
    } = req.query;
    let json = { upId:'' };//...req.query
    delete json.pageSize;
    delete json.pageIndex;
    let pageStart = (pageIndex - 1) * pageSize; // 起始条
    let str = "";
    for (let [label, value] of Object.entries(json)) {
      if (value) {
        if (str) {
          str = `${str} and ${label}="${value}"`;
        } else {
          str = `${label}="${value}"`;
        }
      }
    }
    if (str) str = `where ${str}`;

    let sql = `select * from video_list ${str} order by videoTime desc limit ${pageStart},${pageSize}`;
    db.dbquery(sql).then((result) => {
      res.send({ code: 0, data: result, message: "新增成功" });
    });
  }

  // 更新用户信息
  updateUser(req, res) {
    let { userId, playerId, playerName } = req.body;
    if (!userId) {
      res.send({ code: 1, message: "没有id" });
      return;
    }
    if (!playerId || !playerName) {
      res.send({ code: 1, message: "缺失玩家信息" });
      return;
    }
    let json = {
      last_visit: publicJs.getTime(true),
      player_id: playerId,
      player_name: playerName,
    };
    db.update("user", json, { user_id: userId }).then(() => {
      res.send({ code: 0, message: "更新成功" });
    });
  }

  // 新增收藏
  addCollection(req, res) {
    let { userId, itemId } = req.query;
    let id = snid.generate();
    db.add("my_collection", {
      item_id: itemId,
      user_id: userId,
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
    db.querySql("my_collection", {
      user_id: userId,
    }).then((result) => {
      let arr = result.map((v) => ({
        id: v.id,
        item_id: v.item_id,
      }));
      res.send({ code: 0, data: arr, message: "成功" });
    });
  }

  // 获取用户openId
  getOpenId(req, res) {
    // let a = encode("wxa5e5a9a17ed70a29");
    // let c = encode("a971ec96643d4cb0e0aa2f67be7bedfd");
    let { code } = req.query;
    let appId = "wxa5e5a9a17ed70a29";
    let secret = "a971ec96643d4cb0e0aa2f67be7bedfd";
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    axios({ url }).then((response) => {
      res.send(response);
    });
  }
}

module.exports = new App();
