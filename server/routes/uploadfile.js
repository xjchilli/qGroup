/**
 * Created by Miaowei on 2017/4/28.
 */
/**
 * Created by picohood on 17-3-28.
 */
const router = require('koa-router')();
/* eslint no-param-reassign: ["error", { "props": false }]*/
import {config as sysConfig} from '../PicoCfg/config';
import {updateVersionInfo} from '../db/system/version-files';

var parse = require('co-busboy');
var fs = require('fs');
var os = require('os');
var path = require('path');

const multer = require('koa-multer');

const VersionFilesPath = sysConfig.upgradePath;
let versionFilesAbsolutePath = VersionFilesPath+"\\";
let versionFileName = '';

const mkdirVersionFilesPath = function(){
  mkdirs(VersionFilesPath, function () {
    versionFilesAbsolutePath = path.resolve(VersionFilesPath)+"\\";
  });
}

// function validVersionFile(value) {
//   if (!!value && !(/^XB_((\d){1,3})(_)(\d){1,3}(_)[1,2](.bin$)/.test(value))) {
//     return false;
//   }
//   return true;
// }

export function validVersionFile(value) {
  if (value && ((/^XBFPGA_((\d){1,3})(_)(\d){1,3}(.bit)/.test(value)) || ((/^XB_((\d){1,3})(_)(\d){1,3}(.bin$)/.test(value))))) {
    return true;
  }
  return false;
}

function isFpgaVersionFile(value){
  if(value && (/^XBFPGA_((\d){1,3})(_)(\d){1,3}(.bin$)/.test(value))){
    return true;
  }
  return false;
}

function mkdirs(dirname, callback) {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback();
    } else {
      mkdirs(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
      });
    }
  });
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, VersionFilesPath);
  },
  filename: function (req, file, cb) {
    versionFileName = file.originalname;
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: storage })

router.post('/', upload.any());

router.post('/', async (ctx) => {

  const response = {
    success: true,
  };
  ctx.response.body = response;
});

module.exports = router;
module.exports.mkdirVersionFilesPath = mkdirVersionFilesPath;
