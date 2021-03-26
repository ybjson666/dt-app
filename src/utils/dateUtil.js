import router from "../router";

/**
 * 小于10前面加缀0   3位+进行设置count进行格式化
 * @param num 值
 * @param count 默认为0 如果要3位数的情况走count循环检测 其他情况走num值
 */
export function numFormat(num, count = 0) {
  if (count != 0) { // 2位可以默认count为0
    if (count < 3) console.warn("numFormat() count less than 3", num, count);
    let r = "";
    for (let i = (num + "").length; i < count; i++) {
      r += "0";
    }
    return r + num;
  }
  return num > 9 ? num : '0' + num;
}

/**
 * 根据时间戳、UTC格式时间、数字 获取 mm:ss、HH:mm:ss 、yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 * @param time 0表示当前时间isyyyyMMddShow直接表示为true、时分秒数字总和比如3600秒、时间戳等
 * @param isHh 如果false返回mm:ss 并且isyyyyMMddShow是true则返回yyyy-MM-dd 如果是2只有总秒数
 * @param isyyyyMMddShow true返回 年月日 默认为数字表示time组合情况
 * @param isUtc 是否是UTC时间戳 只有时间戳才生效
 * @param yyyyMMddFixed 年月日的后缀默认是-
 * @param fixed 时分秒后面的后缀 比如冒号：
 * @param ddFixedHH 日期和小时中间缀 如空格或者T
 */
export function getHHmmssOrFull(time/*: number | string | any*/ = null, isHh/*: boolean | number*/ = true, isyyyyMMddShow/*: boolean | number*/ = 3, isUtc = false, yyyyMMddFixed = "-", fixed = ":", ddFixedHH = " ")/*: string*/ {
  if (time <= 0 && time != null) return (isHh ? "00:" : "") + "00:00";
  if (typeof time == "string" && time.indexOf("T") == -1) time = parseInt(time);
  let r/*: string */ = "";
  let h = 0, m = 0, s = 0; // 时分秒初始化
  if ((time + "").length >= 9 || time == null || typeof time == "string" && time.indexOf("T") != -1) { // 表示是时间戳 10 或者是13
    if (typeof time == "string" && time.indexOf("T") != -1 && time.indexOf("Z") == -1) time += "Z"; // 如果是utc时间
    if (typeof time == "number" && time != -1 && Math.floor(time).toString().length <= 11) time *= 1000; // 去掉小数点成立
    let date = time == null ? new Date() : new Date(time);//直接用 new Date(13位时间戳) 格式转化获得当前时间
    if (isUtc && time != null && typeof time == "number") {
      let utcTimeStr = this.getHHmmssOrFull(time, true, true, false, "-", ":", "T") + "Z"; // 时间戳先转成ISO-8601格式时间UTC
      date = new Date(utcTimeStr); // 转成本地时间
      isUtc = false;
      // console.log(utcTimeStr, date)
    }
    h = date.getHours();//.getHours(); // 60*60 1个小时
    m = date.getMinutes();
    s = date.getSeconds();
    if (isHh == 2) return numFormat(s); // 只返回秒数
    if (isHh == 3) return numFormat(s + m * 60); // 只返回秒数 秒数+分钟秒数
    if (!isHh && isyyyyMMddShow == 3) isyyyyMMddShow = false; // 自动转换成 yyyy-MM-dd HH:mm:ss
    if (isyyyyMMddShow) { // 如果支持年月日的话
      let y = 0, M = 0, d = 0; // 年月日初始化
      y = date.getFullYear();
      M = date.getMonth() + 1;
      d = date.getDate();
      r += y + yyyyMMddFixed;
      r += numFormat(M) + yyyyMMddFixed; // mm
      r += numFormat(d) + ddFixedHH; // mm
      if (!isHh) return r;
    }
  } else { // 这个表示只是获取时分秒级别的
    let hY = time % 3600;
    h = Math.floor(time / 3600); // 60*60 1个小时
    m = Math.floor(hY / 60);
    s = Math.floor(hY % 60);
  }
  if (h > 0 && isHh == true) r += numFormat(h) + fixed; // HH
  else if (isHh == true) r += "00" + fixed;
  if (isHh !== 2) r += numFormat(m) + fixed; // mm
  else return time + "";
  r += numFormat(s);
  return r;
}

/** 根据年月日时分秒获取时间戳 格式 yyyy-MM-dd HH:mm:ss、yyyy/MM/dd HH:mm:ss  */
export function getTimestamp(d, isMillisecond = false) {
  if (d == null) return 0;
  if (typeof d == "number") {
    if (!isMillisecond && d > 10000000000) return d / 1000;
    if (isMillisecond && d < 10000000000) return d * 1000;
    return d;
  }
  if (d == "") return 0;
  if (d.indexOf("/") == -1 && d.indexOf("-") == -1) return 0; // 必须包含年月日 时  时可以没有 但是必须有 空格
  let ttt = new Date((d).replace(new RegExp("-", "gm"), "/")).getTime();
  return isMillisecond ? ttt : ttt / 1000;
}

/**
 * 时间转为秒
 * @param time 时间(00:00:00) 或者是(00:00)
 * @returns {string} 时间戳（单位：秒）
 */
export function HHmmssToss(time) {
  let s = 0;
  let ts = time.split(':');
  var hour = ts[0];
  var min = ts[1];
  var sec = ts[2];

  s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s;
}

