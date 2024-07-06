const axios = require("./../../model/axios.js");
const localJson = require("./../../assets/js/local/localData.js");
const fileJson = require("./../../assets/fileList.json");
const Bagpipe = require("bagpipe");
const bagpipe = new Bagpipe(10, {
    timeout: 1000,
}); //
const fs = require("fs");
const path = require("path");
const downLoad = require("../../model/downLoad");
let fileDir = path.resolve(__dirname, "./../../file");
const request = require("request");

// const itemsArr = require("./../../assets/json/itemArr.js");
// const tree = require("./../../assets/json/tree.js");

// 其他脚本

/**
 *
 */
class Api {
    /**
     * 调取本地文件，把英文翻译成中文
     * 已处理完成，现在废弃
     */
    static async setData(req, res) {
        let items = [];
        return;
        let params = {};
        let params2 = {};
        let desParams = {};
        for (let i = 0; i < items.length; i++) {
            let v = items[i];
            if (v.LocalizedNames) {
                params[v.UniqueName] = v.LocalizedNames["ZH-CN"];
                params2[v.UniqueName] = [v.LocalizedNames["ZH-CN"]];
            }
            if (v.LocalizedDescriptions) {
                desParams[v.UniqueName] = v.LocalizedDescriptions["ZH-CN"];
            } else {
                desParams[v.UniqueName] = null;
            }
        }
        console.log(1);
    }

    /**
     * 拿到原始数据 第一次处理
     */
    static async setTree(req, res) {
        return;
        let json = itemsArr;
        delete json.hideoutitem;
        delete json.killtrophy;
        delete json.shopcategories;
        console.log(json);
    }

    /**
     * 拿到第一次处理的数据 第二次处理。
     * 过滤不要的数据
     */
    static async setTree2(req, res) {
        return;
        let arr = Object.entries(itemsArr);
        let arr2 = [];
        for (let [label, value] of arr) {
            let a = value
                .map((v) => {
                    let names = [];
                    if (v.enchantments && v.enchantments.enchantment) {
                        if (v.enchantments.enchantment instanceof Array) {
                            names = v.enchantments.enchantment.map(
                                (s) => `${v["@uniquename"]}@${s["@enchantmentlevel"]}`
                            );
                        } else if (typeof v.enchantments.enchantment == "object") {
                            let s = v.enchantments.enchantment;
                            names = [`${v["@uniquename"]}@${s["@enchantmentlevel"]}`];
                        }
                    }
                    names.push(v["@uniquename"]);
                    return {
                        type: v["@shopsubcategory1"],
                        shopcategory: v["@shopcategory"],
                        names: names,
                    };
                })
                .filter((v) => v.type);
            arr2.push(...a);
            //   json2[label] = value.map();
        }
        console.log(arr2);
    }

    /**
     * 拿到第二次处理的数据 第三次处理。
     * 生成菜单
     * 主菜单（所有，默认只有前30个数据，过多数据，导致搜索慢）
     * length 187
     */
    static async createTree(req, res) {
        let json = {};
        let json2 = {};
        let maxNum = 30;
        itemsArr.forEach((v) => {
            if (json[v.type]) {
                json[v.type].push(...v.names);
            } else {
                json[v.type] = v.names;
            }

            if (json2[v.shopcategory]) {
                json2[v.shopcategory].push(...v.names);
            } else {
                json2[v.shopcategory] = v.names;
            }
        });
        let params = {};
        for (let [label, value] of Object.entries(json)) {
            params[label] = value.join(",");
        }
        let params2 = {};
        for (let [label, value] of Object.entries(json2)) {
            params2[label] = value.slice(0, maxNum).join(",");
        }
        let params3 = {
            ...params,
            ...params2,
        }; // length 187
        // console.log(params3);
        return {
            ...params,
            ...params2,
        };
    }

    // 处理菜单
    static async downAllImg2(req, res) {}

    // 处理数据 2022-11-23
    static async filterData(req, res) {

    }
}

bagpipe.on("full", function(length) {
    console.log("底层系统处理不能及时完成，队列堵塞，目前队列长度" + length);
});

module.exports = {
    //
    setData(req, res) {
        res.send({ code: 200, msg: "已暂停" });
        Api.filterData(req, res);
    },
};