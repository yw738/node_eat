/**
 * chimie 入库
 */
const db = require("../../utils/mysql.js");
const publicJs = require("../../utils/index.js");
const SnowflakeID = require("../../utils/snowflakeID.js");
const axios = require("../../model/axios.js");
const jiemiChimie = require("../../model/jmChimie.js");

let token = "CZ-gw8ypobsyhgnxdmhawvy";
// token:
// 雪花id
const snid = new SnowflakeID({
  mid: +new Date(),
});

let apiList = {};

let setpFn = async (number = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number);
  });
};
let emojiReg =
  /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
// let id = snid.generate();
class ChiMie {
  // 新增up list
  cmGetUpList(req, res) {
    let url = `https://chimie.fun/vsd/up/showList`;
    axios({
      url,
      headers: {
        token: token,
      },
    }).then((response) => {
      let list = response.data;
      list.forEach((v, i) => {
        let id = snid.generate();
        let json = {
          id: id,
          up_id: v.id,
          up_name: v.name,
          showName: v.showName,
          up_avatar: v.avatar,
          fans: v.fans,
          videoTime: v.videoTime,
          mainArea: v.mainArea,
          otherArea: v.otherArea,
          description:
            v.desc && v.desc?.length
              ? v.desc.join("666").replace(/\"/g, "“").replace(/\'/g, "‘")
              : "",
        };
        db.querySql("up_list", {
          up_id: v.id,
        }).then((result) => {
          if (!result?.length) {
            db.add("up_list", json).then(() => {
              console.log("插入成功", v.name);
            });
          }
        });
      });
      res.send("ok");
    });
  }

  //获取指定up的视频
  static async addVideo(upStr = "54") {
    let url = `https://chimie.fun/vsd/shopShow/list/v1`;
    let pageIndex = 0;
    console.log("===================分割====================");
    for (let i = 0; i < 20; i++) {
      let params = {
        offset: pageIndex,
        sort: 1,
        searchKey: "",
        menuType: "全部",
        upStr: upStr,
        maxPrice: 10000,
        minPrice: 0,
      };
      let imgList = await axios({
        url,
        method: "POST",
        headers: {
          token: token,
        },
        params,
      }).then(async (response) => {
        let { code, data } = response;
        if (code != 0) return;
        let list = jiemiChimie(response.data.encryptStr);
        let { imgList = [], imgUpList } = data;
        list.forEach((v, i) => {
          let json = {
            id: v.id,
            up_id: upStr,
            name: v.name,
            cityName: v.cityName,
            distance: v.distance,
            videoImg: imgList[i],
            videoTime: v.videoTime,
          };

          db.querySql("video_list", {
            id: v.id,
          }).then((result) => {
            if (!result?.length) {
              db.add("video_list", json).then(() => {
                console.log(`插入成功--up：${upStr}-- ${i} --${v.name}`);
              });
            }
          });
        });
        return imgList || [];
      });
      if (!imgList?.length) {
        break; // 当满足某个条件时，跳出循环
      }
      pageIndex++;
    }
  }

  // 获取所有up 列表 循环调 addVideo
  getAllVideoList(req, res) {
    db.selectAll("up_list").then(async (result) => {
      let arr = result.map((v) => v.up_id);
      for (let i = 0; i < arr.length; i++) {
        await setpFn(5000);
        await ChiMie.addVideo(arr[i]);
      }
      res.send({ code: 0, data: arr, message: "成功" });
    });
  }

  // 根据视频id 去查询 所有的 店铺地址
  static async addshop(id = "20823") {
    let url = `https://chimie.fun/vsd/shopDetail/shopDetailId/${id}`;
    await axios({
      url,
      headers: {
        token: token,
      },
    }).then(async (response) => {
      let { code, data } = response;
      if (code != 0) return;
      let params = jiemiChimie(data);
      let { detailDto, shopList: list } = params;
      let json2 = { bid: "", videoId: "", videoTitle: "" };
      detailDto.bid ? (json2.bid = detailDto.bid) : "";
      detailDto.videoId ? (json2.videoId = detailDto.videoId) : "";
      detailDto.videoTitle
        ? (json2.videoTitle = detailDto.videoTitle
            .replace(/\"/g, "“")
            .replace(emojiReg, ""))
        : "";
      db.update("video_list", json2, { id: detailDto.id }).then(() => {
        console.log(`${detailDto.id}--视频数据更新成功`);
      });
      list.forEach((v, i) => {
        let json = {
          id: v.id,
          name: v.name || "",
          address: v.address ? v.address.replace(/\"/g, "“") : "",
          avgPrice: v.avgPrice || "",
          tel: v.tel || "",
          typeStr: v.typeStr || "",
          showTimeStr: v.showTimeStr || "",
          canteenFlag: 1,
          latitude: v.latitude || "",
          longitude: v.longitude || "",
          shopUuid: v.shopUuid || "",
          dpCategory: v.dpCategory || "",
          evaluateNum: v.evaluateNum ? +v.evaluateNum : 0,
          workTime: v.workTime || "",
          isClose: 1,
          commentScore: v.commentScore || "暂无",
        };

        // 新增关联关系
        db.querySql("shop_contact", {
          videoId: v.detailId,
          addressId: v.id,
        }).then((result) => {
          if (!result?.length) {
            db.add("shop_contact", {
              videoId: id,
              addressId: v.id,
            }).then(() => {});
          }
        });

        // 新增店铺地址
        db.querySql("shop_list", {
          id: v.id,
        }).then((result) => {
          if (!result?.length) {
            db.add("shop_list", json).catch((err) => {
              console.log("报错了", err);
            });
          }
        });
      });
    });
  }

  /**
   * 获取所有视频id 列表 循环调 addshop
   */
  getAllshopList(req, res) {
    db.selectAll("video_list").then(async (result) => {
      let arr = result.map((v) => v.id);
      res.send({ code: 0, data: arr, message: "成功" });
      for (let i = 1417; i < arr.length; i++) {
        await setpFn(1000);
        console.log("===================分割====================");
        console.log(`${i} / ${arr.length}`);
        await ChiMie.addshop(arr[i]);
      }
      console.log("over");
    });
  }

  /**
   * 录入指定up的新视频 且入库
   */
  async addUpShop(req, res) {
    let { upId } = req.body;
    let url = `https://chimie.fun/vsd/shopShow/list/v1`;
    let params = {
      offset: 0,
      sort: 1,
      searchKey: "",
      menuType: "全部",
      upStr: upId,
      maxPrice: 10000,
      minPrice: 0,
    };
    await axios({
      url,
      method: "POST",
      headers: {
        token: token,
      },
      params,
    }).then(async (response) => {
      let { code, data } = response;
      if (code != 0) return;
      let list = jiemiChimie(response.data.encryptStr);
      let { imgList = [], imgUpList } = data;

      // let videoIdArr = [];
      //
      // for (let i = 0; i < list.length; i++) {}
      res.send({ message: "开始更新。。。" });
      list.forEach((v, i) => {
        let json = {
          id: v.id,
          up_id: upId,
          name: v.name,
          cityName: v.cityName,
          distance: v.distance,
          videoImg: imgList[i],
          videoTime: v.videoTime,
        };
        db.querySql("video_list", {
          id: v.id,
        }).then((result) => {
          if (!result?.length) {
            ChiMie.addshop(v.id);
            db.add("video_list", json).then(async () => {
              console.log(
                `成功--视频更新成功--：up：${upId}-- ${i} --${v.name}`
              );
            });
          } else {
            console.log(`该视频已存在--${v.name}--`);
          }
        });
      });
      // for (let i = 0; i < videoIdArr.length; i++) {
      //   await setpFn(1000);
      //   await ChiMie.addshop(videoIdArr[i]);
      // }

      // return imgList || [];
    });
  }

  /**
   * 获取所有up 列表 循环调 addUpShop
   */
  addAllUpShop(req, res) {
    let cmApi = new ChiMie();
    db.selectAll("up_list").then(async (result) => {
      let arr = result.map((v) => v.up_id);
      res.send({ code: 0, message: "开始" });
      for (let i = 0; i < arr.length; i++) {
        await cmApi.addUpShop(
          {
            body: { upId: arr[i] },
          },
          { send: () => {} }
        );
        await setpFn(5000);
      }
      console.log(`===============================================`);
      console.log(`==================全部更新完毕==================`);
      console.log(`===============================================`);
    });
  }
}

module.exports = new ChiMie();
