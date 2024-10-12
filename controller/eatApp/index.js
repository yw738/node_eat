/**
 * 吃
 */
const db = require("../../utils/mysql.js");
const publicJs = require("../../utils/index.js");
const SnowflakeID = require("../../utils/snowflakeID.js");
const request = require("request");
const axios = require("./../../model/axios.js");
const salting = require("./../../model/salting.js");

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

  /**
   * 查 视频列表
   */
  getList(req, res) {
    let {
      pageSize = 20,
      pageIndex = 1,
      upId = "",
      city = "",
      keyword = "",
      foodType = "",
    } = req.query;
    let json = { up_id: upId, cityName: city }; //...req.query
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

    let sql0 = `select * from video_list ${str} order by videoTime desc limit ${pageStart},${pageSize}`;
    let sql = `SELECT
                  e.*,
                  f.avgPrice,
                  f.latitude,
                  f.longitude 
                FROM
                  (
                  SELECT
                    * 
                  FROM
                    (
                    SELECT
                      b.up_name,
                      a.id,
                      a.name,
                      a.videoTime,
                      a.videoTitle,
                      a.videoImg,
                      a.cityName 
                    FROM
                      ( ${sql0} ) a
                      INNER JOIN up_list b ON a.up_id = b.up_id 
                    ) c
                    INNER JOIN shop_contact d ON c.id = d.videoId 
                  ) e
                  INNER JOIN shop_list f ON e.addressId = f.id group by e.id`;

    db.dbquery(sql).then((result) => {
      res.send({ code: 0, data: result, message: "ok" });
    });
  }

  /**
   * 查 视频详情 包含具体店铺 + 店铺坐标
   */
  async getDetail(req, res) {
    // video id
    let { id = "" } = req.query;
    if (!id) {
      res.send({ code: 1, data: {}, message: "无id" });
      return;
    }
    let sql = `select * from (select * from shop_contact a WHERE a.videoId='${id}') a inner join shop_list b on a.addressId = b.id ;`;
    let sql2 = `select * from video_list where id='${id}'`; // 查视频
    let addressDto = await db.dbquery(sql).then((result) => result); // 视频 关联的地址
    let videoDto = await db.dbquery(sql2).then((result) => result[0]);
    let sql3 = `select * from up_list a where a.up_id='${videoDto.up_id}'`; // 查up
    let upDto = await db.dbquery(sql3).then((result) => result[0]);
    videoDto.shopList = addressDto;
    videoDto.upDto = upDto;
    // salting.encryptFn(videoDto)
    res.send({ code: 0, data: videoDto, message: "ok" });
  }

  /**
   * app 初始化 查所有的字典
   */
  async appInit(req, res) {
    let {} = req.query;
    let foodList = await db.querySql("food_type");
    let pageStart = (pageIndex - 1) * pageSize; // 起始条
    let sql = `SELECT * FROM video_list WHERE up_id = '${id}' order by videoTime desc limit ${pageStart},${pageSize};`;
    let addressDto = await db.dbquery(sql).then((result) => result); // 视频 关联的地址
    videoDto.shopList = addressDto;
    videoDto.upDto = upDto;
    res.send({ code: 0, data: videoDto, message: "ok" });
  }

}

module.exports = new App();
