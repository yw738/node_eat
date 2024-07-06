/**
 * demo
 * 参考用的
 */
const express = require("express");
const db = require("/mssql.js");
const moment = require("moment");
const router = express.Router();

/* GET home page. */
router.get("/info", function(req, res, next) {
    db.selectAll("userInfo", function(err, result) {
        //查询所有userInfo表的数据
        res.send(result.recordset);
        // res.render('userInfo', { results: result.recordset, moment: moment });
    });
});
router.post("/delete", function(req, res, next) {
    //删除一条id对应的userInfo表的数据
    console.log(req.body, 77);
    const { UserId } = req.body;
    const id = UserId;
    db.del("where id = @id", { id: id }, "userInfo", function(err, result) {
        console.log(result, 66);
        res.send("ok");
    });
});
router.post("/update/:id", function(req, res, next) {
    //更新一条对应id的userInfo表的数据
    var id = req.params.id;
    var content = req.body.content;
    db.update({ content: content }, { id: id },
        "userInfo",
        function(err, result) {
            res.redirect("back");
        }
    );
});

module.exports = router;