/**
 * Created by xSoft on 2017-08-23.
 */
function formatDateTime(seconds, nanoSeconds){
  let nsToSeconds = parseInt(nanoSeconds/1000000000);
  let nsToMs = parseInt((nanoSeconds%1000000000)/1000000);
  const dateTimeString = new Date((seconds+nsToSeconds)*1000 + nsToMs).format("yyyy-MM-dd HH:mm:ss.S");    //转成毫秒
  return dateTimeString;
};

///去掉字符串前面的0
function  trimStr(str){
  str =  str.replace(/(^\s*)|(\s*$)/g, "");
  str = str.replace(/(^\0*)|(\0*$)/g, "");
  return str;
}

///比较终端版本与数据库中的最新版本，判断是否存在升级可能
function checkVersion(terminalVersion, newestVersion){
  let res = false;
  let tvDotIndex = terminalVersion.indexOf('.');
  let nvDotIndex = newestVersion.indexOf('.');

  if((tvDotIndex > 0) && (nvDotIndex > 0)){
    let tvMainVersion = parseInt(terminalVersion.substr(0, tvDotIndex));
    let tvBuildVersion = parseInt(terminalVersion.substr(tvDotIndex+1, terminalVersion.length-tvDotIndex));

    let nvMainVersion = parseInt(newestVersion.substr(0, nvDotIndex));
    let nvBuildVersion = parseInt(newestVersion.substr(nvDotIndex+1, newestVersion.length-nvDotIndex));

    if((nvMainVersion > tvMainVersion) || ((nvMainVersion === tvMainVersion) && (nvBuildVersion > tvBuildVersion))){
      res = true;
    }
  }

  return res;
}

function crcCheck(msg, len) {
  var crc = Number(0);
  var current = Number(0);
  for (var i = 0; i < len; i++) {
    current = (msg[i] & 0x000000FF) << 8;
    for (var j = 0; j < 8; j++) {
      if ((crc ^ current) & 0x8000) {
        crc = (crc << 1) ^ 0x1201;
      }
      else {
        crc <<= 1;
      }
      crc &= 0x0000FFFF;
      current <<= 1;
    }
  }

  return crc;
};

module.exports.formatDateTime = formatDateTime;
module.exports.trimStr = trimStr;
module.exports.checkVersion = checkVersion;
module.exports.crcCheck = crcCheck;
