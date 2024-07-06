const axios = require("./../../model/axios.js");
const Bagpipe = require("bagpipe");
const bagpipe = new Bagpipe(10, {
    timeout: 1000,
}); //
const fs = require("fs");
const path = require("path");
let fileDir = path.resolve(__dirname, "./../../file");
const request = require("request");

/**
 * 更新 fileList.json 文件的 图片目录
 * 会自己创建fileList.json || 更新fileList.json
 */
const getFileList = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(
            fileDir, {
                encoding: "utf8",
            },
            (err, files = []) => {
                if (err) throw err;
                console.log("读取的目录内容：", files);
                // files:
                // [
                //     'dirName1',
                //     'dirName2',
                //     ...
                //     'fileName1'
                //     'fileName2'
                //     ...
                // ]
                let saveJson = {};
                if (files instanceof Array) {
                    files.forEach((v) => {
                        let name = v.replace(".png", "");
                        saveJson[name] = 1;
                    });
                }
                fs.writeFileSync(
                    `./assets/fileList.json`,
                    JSON.stringify(saveJson),
                    "utf8",
                    function(err) {
                        console.log("fileList保存成功");
                    }
                );
            }
        );
    });
};

// 延时
let steep = async() =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log(num, "延时-------------------------------------------------------------------------------");
            resolve(1);
        }, 1000);
    });

let num = 0;

/**
 *
 */
class Api {
    /**
     * 下载图片到file 目录的脚本
     * @param {string} name id
     */
    static imgUrl(req, res) {
        let { name = "" } = req.query;
        ((num) => {
            // const url = `https://albiononline2d.ams3.cdn.digitaloceanspaces.com/thumbnails/orig/${name}`; // 其他地址
            const url = `https://render.albiononline.com/v1/item/${name}`; //官网
            request({
                    url: url,
                    method: "GET",
                    encoding: null, //此参数解决图片乱码问题
                    headers: {
                        "Accept-Encoding": "gzip, deflate",
                    },
                },
                function(error, response, body) {
                    console.log(num, "请求状态：", !error && response.statusCode == 200);
                    if (!error && response.statusCode == 200) {
                        fs.writeFile(`./file/${name}.png`, body, "binary", function(err) {
                            console.log(num, "保存图片成功" + name);
                        });
                    }
                }
            );
        })(num);
    }

    /**
     * 下载新图片
     */
    static async downAllImg(req, res) {
        return;
        res.send("开始!!");
        // let arr = Object.entries(localJson);
        let arr = Object.entries(newJson);
        let arr2 = [];
        // arr2 = arr.slice(0, 7991);
        arr2 = arr;
        for (let [itemId, value] of arr2) {
            num++;
            await steep();
            Api.imgUrl({
                query: {
                    name: itemId,
                },
            });
        }
        console.log("全部下载成功！！！");
    }
}

bagpipe.on("full", function(length) {
    console.log("底层系统处理不能及时完成，队列堵塞，目前队列长度" + length);
});

module.exports = {
    updateFileList(req, res) {
        getFileList();
        res.send("已执行更新文件列表的操作!!");
    },
    downAllImg(req, res) {
        Api.downAllImg(req, res);
    },
};