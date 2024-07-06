const axios = require("./../../model/axios.js");
const dataJson = require("./../../assets/js/local/localData.min.js");
const Bagpipe = require("bagpipe");
const bagpipe = new Bagpipe(10, {
    timeout: 1000
}); //
const downLoad = require("../../model/downLoad");
const fs = require("fs");
const path = require("path");
const request = require("request");
const db = require("../../utils/mysql.js");
const fileJson = require("./../../assets/fileList.json");
const desData = require("./../../assets/js//local/desData.min.js");

// 获取 官方的数据api
function getUrl(type = 'base') {
    const urlObj = {
        base: `https://www.albion-online-data.com`, //美服
        east: `https://east.albion-online-data.com`, //亚服
        ams: `https://europe.albion-online-data.com`, //欧服
    }
    return urlObj[type] || urlObj['base']
}

const DATA_URL = `https://gameinfo.albiononline.com/api/gameinfo`; // 官网提供的数据api


/**
 * 对URL的接口进行转发
 */
class Api {

    /**
     * 查询 json 汉化的数据
     */
    static getJsonData(req, res) {
        res.send(dataJson);
    }

    /**
     * 获取价格列表
     * @param {string} str 装备id
     */
    static getPrice(req, res) {
        let {
            str = "", areaType
        } = req.query;

        const url = `${getUrl(areaType)}/api/v2/stats/prices/${str}`;
        axios({
            url
        }).then((response) => res.send(response));
    }

    /**
     * 获取历史价格
     * @param {string} id 装备id
     * @param {string} locations 城市 英文名称
     * @param {string} date 开始时间
     * @param {string} end_date 结束时间
     * @param {number} qualities 品级
     */
    static getHistory(req, res) {
        let {
            id = "", date = "", end_date, qualities, locations, areaType
        } = req.query;
        const url = `${getUrl(areaType)}/api/v2/stats/History/${id}.json?time-scale=24&locations=${locations}&date=${date}&end_date=${end_date}&qualities=${+qualities}`;
        axios({
            url
        }).then((response) => res.send(response));
    }

    /**
     * 获取首页列表
     * @param {string} str 装备id
     * 限制最大查询数量为 100
     */
    static getList(req, res) {
        let {
            str = "", areaType
        } = req.query;
        let newStr = str.split(",").slice(0, 100).join(",");
        if (!newStr) {
            return res.send([]);
        }
        const url = `${getUrl(areaType)}/api/v2/stats/prices/${newStr}?locations=Thetford&qualities=1`;
        axios({
            url
        }).then((response) => res.send(response));
    }

    /**
     * 通过id查询装备具体信息
     * @param {string} id 装备id
     */
    static async getItemData(req, res) {
        let {
            id = "", userId = ""
        } = req.query;
        // 先检查本地是否有，有直接返回
        if (desData[id]) {
            try {
                let arr = await db
                    .querySql("my_collection", {
                        user_id: userId,
                        item_id: id,
                    })
                    .then((result) => result)
                    .catch(() => []);
                res.send({
                    localizedDescriptions: {
                        "ZH-CN": desData[id],
                    },
                    isCollection: Boolean(arr.length), //是否收藏：true 收藏。false 未收藏
                    collectionId: arr[0] ? arr[0].id : "",
                });
            } catch (err) {
                res.send({
                    localizedDescriptions: {
                        "ZH-CN": desData[id],
                    },
                    isCollection: false,
                });
            }
            return;
        }
        const url = `${DATA_URL}/items/${id}/data`;
        axios({
            url
        }).then((response) => res.send(response));
    }

    /**
     * 获取图片地址 转发图片到 阿尔比恩那边 || 请求本地图片
     * @param {string} name 装备id
     * https://albiononline2d.ams3.cdn.digitaloceanspaces.com/thumbnails/orig
     */
    static imgUrl(req, res) {
        let {
            name = ""
        } = req.query;
        // const url = `https://albiononline2d.ams3.cdn.digitaloceanspaces.com/thumbnails/orig/${name}`;
        const imgUrl = `https://render.albiononline.com/v1/item/${name}`; //官网
        // console.log(fileJson)
        /**
         * 检查本地（从文件列表json里面查）有没有这张图片
         *      有  ：直接返回本地路径给前端
         *      没有：请求远程图片url返回给前端
         * fileJson = {'T5_CAPE':1}
         */
        if (fileJson instanceof Object && fileJson[name]) {
            // 请求本地
            request({
                    url: `${global.globalData.local}/${name}.png`, //本地图片地址
                    method: "GET",
                    encoding: null, //此参数解决图片乱码问题
                    headers: {
                        "Accept-Encoding": "gzip, deflate",
                    },
                },
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.set("Content-Type", "image/png;");
                        // console.log('-------------------请求本地-------------------------------')
                        res.send(body);
                    }
                }
            );
            return;
        }
        // 请求阿尔比恩 官网。请求远程，会有点慢。
        request({
                url: imgUrl,
                method: "GET",
                encoding: null, //此参数解决图片乱码问题
                headers: {
                    "Accept-Encoding": "gzip, deflate",
                },
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.set("Content-Type", "image/png;");
                    // console.log('请求远程')
                    res.send(body);
                }
            }
        );
    }
}

module.exports = {
    getJsonData(req, res) {
        Api.getJsonData(req, res);
    },
    getPrice(req, res) {
        Api.getPrice(req, res);
    },
    getList(req, res) {
        Api.getList(req, res);
    },
    getHistory(req, res) {
        Api.getHistory(req, res);
    },
    getItemData(req, res) {
        Api.getItemData(req, res);
    },
    imgUrl(req, res) {
        Api.imgUrl(req, res);
    },
};