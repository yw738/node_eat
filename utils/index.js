/**
 * 公共方法
 */

const getTime = (isHasHMS = false) => {
    const time = new Date();
    const year = time.getFullYear();
    let month = time.getMonth() + 1; //月份是从0开始的
    let day = time.getDate();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    month = month.toString().padStart(2, "00"); //补0
    day = day.toString().padStart(2, "00");
    h = h.toString().padStart(2, "00");
    m = m.toString().padStart(2, "00");
    s = s.toString().padStart(2, "00");
    if (isHasHMS) {
        return `${year}-${month}-${day} ${h}:${m}:${s}`;
    } else {
        return `${year}-${month}-${day}`;
    }
};
exports.getTime = getTime;