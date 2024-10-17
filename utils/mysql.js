/**
 * 封装的建议sql 方法。复杂的，需要自己手写
 * create by 杨非凡
 **/
const mysql = require("mysql");
const conf = require("./config.js");

const connection = mysql.createConnection(conf);
connection.connect(function(err) {
    if (!err) {
        console.log("数据库连接成功");
    } else {
        console.log("数据库连接失败", err);
    }
});

/**
 * 执行sql 查询数据库的方法
 * @param {string} sql sql语句
 * @return {promise}
 */
const dbquery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (error, results, fields) => {
            if (error) {
                reject();
                throw error;
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * 自由查询
 * @param tableName 表名，例如: 'select * from news where id = id'
 * @param params 参数，用来解释sql中的@*，例如： { id: id }
 */
let querySql = function(tableName, params = {}) {
    let str = "";
    for (let [label, value] of Object.entries(params)) {
        if (str) {
            str = `${str} and ${label}="${value}"`;
        } else {
            str = `${label}="${value}"`;
        }
    }
    let sql = `select * from ${tableName} where ${str}`;
    return dbquery(sql);
};

/**
 * 查询指定表的所有数据
 * @param tableName 数据库表名
 */
let selectAll = function(tableName) {
    let sql = "select * from " + tableName + " ";
    return dbquery(sql);
};

/**
 * 添加字段到指定表
 * INSERT INTO Websites (name, url, country) VALUES ('stackoverflow', 'http://stackoverflow.com/', 'IND');
 * @param params 需要添加的对象字段，例：{ name: 'name', age: 20 }
 * @param tableName 数据库表名
 */
let add = function(tableName, params) {
    let keyStr = Object.keys(params).join(",");
    let valueStr = Object.values(params)
        .map((v) => `"${v}"`)
        .join(",");
    let sql = `INSERT INTO ${tableName} (${keyStr}) VALUES (${valueStr});`;
    return dbquery(sql);
};

/**
 * 更新指定表的数据
 * UPDATE table_name SET column1=value1,column2=value2,... WHERE some_column=some_value;
 * @param updateObj 需要更新的对象字段，例：{ name: 'name', age: 20 }
 * @param whereObj 需要更新的条件，例: { id: id }
 * @param tableName 数据库表名
 */
let update = function(tableName, updateObj, whereObj) {
    let str = "";
    let updateStr = "";
    for (let [label, value] of Object.entries(whereObj)) {
        if (str) {
            str = `${str} and ${label}="${value}"`;
        } else {
            str = `${label}="${value}"`;
        }
    }
    for (let [label, value] of Object.entries(updateObj)) {
        if (updateStr) {
            updateStr = `${updateStr},${label}="${value}"`;
        } else {
            updateStr = `${label}="${value}"`;
        }
    }
    let sql = `UPDATE ${tableName} SET ${updateStr} WHERE ${str};`;
    return dbquery(sql);
};

/**
 * 删除指定表字段
 * DELETE FROM Websites WHERE name='Facebook' AND country='USA';
 * @param params 参数，用来解释sql中的@*，例如： { id: id }
 * @param tableName 数据库表名
 */
let del = function(tableName, params) {
    let str = "";
    for (let [label, value] of Object.entries(params)) {
        if (str) {
            str = `${str} and ${label}="${value}"`;
        } else {
            str = `${label}="${value}"`;
        }
    }
    let sql = `DELETE FROM ${tableName} WHERE ${str};`;
    return dbquery(sql);
};

exports.config = conf;
exports.del = del;
exports.update = update;
exports.querySql = querySql;
exports.selectAll = selectAll;
exports.add = add;
exports.dbquery = dbquery;
exports.escapeFn = connection.escape