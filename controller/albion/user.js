const axios = require("./../../model/axios.js");
const dataJson = require("./../../assets/js/translateData.js");
const Bagpipe = require("bagpipe");
const bagpipe = new Bagpipe(10, {
  timeout: 1000,
}); //
const downLoad = require("../../model/downLoad");
const fs = require("fs");
const path = require("path");
const request = require("request").defaults({
  // proxy: "http://127.0.0.1:8081",
  rejectUnauthorized: false,
});

// 官网提供的数据api
function getDataUrl(type = "base") {
  const dataObj = {
    base: `https://gameinfo.albiononline.com`, //美服
    east: `https://gameinfo-sgp.albiononline.com`, //亚服
    ams: `https://gameinfo-ams.albiononline.com`, //欧服
  };
  let url = dataObj[type] || dataObj[base];
  return `${url}/api/gameinfo`;
}

/**
 * 用户信息
 */
class Api {
  /**
   * 通过用户名称查用户信息列表（模糊查询，获取id 列表）
   * https://gameinfo.albiononline.com/api/gameinfo/search?q=Meibo
   *  @param {string} name 玩家相关的关键字
   */
  static getUserList(req, res) {
    let { name = "Meibo", areaType } = req.query;
    let url = `${getDataUrl(areaType)}/search?q=${name}`;

    axios({
      url,
    }).then((response) => res.send(response));
  }

  /**
   * 玩家信息，如姓名、公会和具有给定ID的玩家的终身统计数据
   * https://gameinfo.albiononline.com/api/gameinfo/players/ET9MUE96Stq_iYlBXput0w
   * @param {string} playerId 玩家id
   */
  static getUserInfo(req, res) {
    let { playerId = "ET9MUE96Stq_iYlBXput0w", areaType } = req.query;
    let url = `${getDataUrl(areaType)}/players/${playerId}`;
    console.log(url);
    let a = `{"AverageItemPower":0.0,"Equipment":{"MainHand":null,"OffHand":null,"Head":null,"Armor":null,"Shoes":null,"Bag":null,"Cape":null,"Mount":null,"Potion":null,"Food":null},"Inventory":[],"Name":"Meibo","Id":"ET9MUE96Stq_iYlBXput0w","GuildName":"","GuildId":"","AllianceName":"","AllianceId":"","AllianceTag":"","Avatar":"AVATAR_05","AvatarRing":"RING1","DeathFame":583604,"KillFame":1135413,"FameRatio":1.95,"LifetimeStatistics":{"PvE":{"Total":13239663,"Royal":8176439,"Outlands":1222491,"Avalon":3393,"Hellgate":0,"CorruptedDungeon":713396,"Mists":199366},"Gathering":{"Fiber":{"Total":4915,"Royal":4663,"Outlands":0,"Avalon":0},"Hide":{"Total":31953,"Royal":26514,"Outlands":4648,"Avalon":247},"Ore":{"Total":6946,"Royal":6625,"Outlands":22,"Avalon":0},"Rock":{"Total":126,"Royal":126,"Outlands":0,"Avalon":0},"Wood":{"Total":4944,"Royal":4471,"Outlands":0,"Avalon":0},"All":{"Total":48884,"Royal":42399,"Outlands":4670,"Avalon":247}},"Crafting":{"Total":875487,"Royal":0,"Outlands":0,"Avalon":0},"CrystalLeague":0,"FishingFame":174945,"FarmingFame":308600,"Timestamp":"2024-04-28T01:41:04.923243Z"}}`;
    res.send(a);
    return;
    axios({
      url,
    }).then((response) => res.send(response));
  }

  /**
   * 最后 10 次击杀报告导致具有给定 ID 的玩家死亡
   * https://gameinfo.albiononline.com/api/gameinfo/players/ET9MUE96Stq_iYlBXput0w/deaths
   * @param {string} playerId 玩家id
   */
  static getUserDeath(req, res) {
    let { playerId = "ET9MUE96Stq_iYlBXput0w", areaType } = req.query;
    let url = `${getDataUrl(areaType)}/players/${playerId}/deaths`;
    axios({
      url,
    }).then((response) => res.send(response));
  }

  /**
   * 有关指定 ID 的最新 10 次杀戮（击杀）的信息
   * https://gameinfo.albiononline.com/api/gameinfo/players/ET9MUE96Stq_iYlBXput0w/kills
   * @param {string} playerId 玩家id
   */
  static getUserKill(req, res) {
    let { playerId = "ET9MUE96Stq_iYlBXput0w", areaType } = req.query;
    let url = `${getDataUrl(areaType)}/players/${playerId}/kills`;
    axios({
      url,
    }).then((response) => res.send(response));
  }

  /**
   * 基本公会信息，如姓名、创始人和创始人、联盟、名气和成员数量
   * @param {string} guildId 玩家id
   */
  static getGuilds(req, res) {
    let { guildId = "GxTIPIMiTsCWao3rv4izTg", areaType } = req.query;
    let url = `${getDataUrl(areaType)}/guilds/${guildId}`;
    axios({
      url,
    }).then((response) => res.send(response));
  }

  /**
   * 暂无
   * https://gameinfo.albiononline.com/api/gameinfo/events/631005418
   * @param {string} playerId
   */
  //   static getUserList(req, res) {
  //     let { playerId = "ET9MUE96Stq_iYlBXput0w" } = req.query;
  //     let url = `${BASE_URL}/api/gameinfo/events/${playerId}`;
  //     axios({ url }).then((response) => res.send(response));
  //   }
}

module.exports = {
  getUserList: (req, res) => Api.getUserList(req, res),
  getUserInfo(req, res) {
    Api.getUserInfo(req, res);
  },
  getUserDeath(req, res) {
    Api.getUserDeath(req, res);
  },
  getUserKill(req, res) {
    Api.getUserKill(req, res);
  },
};
