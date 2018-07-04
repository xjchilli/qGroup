const router = require('koa-router')();
const role = require('./account/role');
const users = require('./account/users');
const uploadfile = require('./uploadfile');
const versionFiles = require('./system/version-files');
const picolog = require('./log/operationLog');

const qs = require('qs');    // add by ycx
const crypto = require('crypto');

import {getUserByUserName, updateUserPwdByName} from '../db/account/user';
import {getPowerByRoleId} from '../db/account/role';
import {ErrorNo} from '../constant';

const path_power = {
  "/main/dashboard":[1,2],
  "/main/account":[1],
  "/main/account/modify-password":[1,2,3,4,5],
  "/main/account/role":[1,2,3,4,5],
  "/main/account/user":[1,2,3,4,5],
  "/main/log":[1],
  "/main/log/picoLog":[1,2,3,4,5],
  "/main/system":[1],
  "/main/system/version-files":[1,2,3,4,5]
};

const access_uncheck_power = {
  1: [],              //管理平台
  5: [1],                 //设备管理-
  6: [1, 2, 3, 4, 5],     //设备管理-线路管理
  7: [1, 2, 3, 4, 5],     //设备管理-杆塔管理
  8: [1, 2, 4, 7, 9],     //设备管理-终端管理
  9: [1, 2, 4],           //设备管理-终端参数
  10: [1],                //终端数据-
  11: [1, 2],             //终端数据-终端状态
  12: [1, 2],             //终端数据-行波记录
  13: [1, 2],             //终端数据-故障电流
  14: [1],                //日志记录-
  15: [1, 2],             //日志记录-操作日志
  16: [1, 2],             //日志记录-短信日志
  17: [1],                //系统管理-
  19: [1, 2, 3, 4, 5],    //系统管理-版本文件
  20: [1, 2, 3, 4, 5],    //系统管理-告警通知设置
  21: [1],                //数据分析
  22: [1, 2],             //工况数据
  23: [1, 2],             //类型识别
  24: [1, 2],             //测距定位
};

//admin power;
// const power = {
//   1: [1, 2],              //管理平台
//   2: [1],                 //帐户管理-
//   3: [1, 2, 3, 4, 5],     //帐户管理-密码修改
//   4: [1, 2, 3, 4, 5],     //帐户管理-角色管理
//   5: [1, 2, 3, 4, 5],     //帐户管理-用户管理
//   6: [1],                //日志记录-
//   7: [1, 2, 3, 4, 5],     //日志记录-操作日志
//   8: [1],                //系统管理-
//   9: [1, 2, 4],          //系统管理-修改密码
// };

const power = {
  1: [1, 2],              //管理平台
  2: [1],                 //帐户管理-
  3: [1, 2, 3, 4, 5],     //帐户管理-密码修改
  6: [1],                //日志记录-
  7: [1, 2, 3, 4, 5],     //日志记录-操作日志
  8: [1],                //系统管理-
  9: [1, 2, 4],          //系统管理-升级
};

router.post('/api/check', async (ctx) => {
    let res = {
        success: true,
        role_power: access_uncheck_power,
        path_power: path_power,
    }

    ctx.body = res;
});


// 修改密码
router.put('/api/modifyPassword', async (ctx) => {

  const passWordMsg = eval(ctx.request.body);

  let orgPwd = getPwd(passWordMsg.username);

  let  decipher = crypto.createDecipher('aes-256-cbc','piCoHood2018');
  let orgPassword=decipher.update(passWordMsg.oldPassword,'hex','utf8');
  orgPassword += decipher.final('utf8');//解密之后的值

  let  decipher2 = crypto.createDecipher('aes-256-cbc','piCoHood2018');
  let newPwd=decipher2.update(passWordMsg.password,'hex','utf8');
  newPwd += decipher2.final('utf8');//解密之后的值

  console.log('modifyPwd', orgPwd, orgPassword, newPwd);

  let res = null;
  if(orgPassword !== orgPwd){
    res = {
      success: false,
      message: "原始密码不正确",
      errorcode: ErrorNo.ERROR_ORIGINAL_PWD
    };
  }else if(passWordMsg.password !== passWordMsg.confirm){
    res = {
      success: false,
      message: "两次密码不一致",
      errorcode: ErrorNo.ERROR_PWD_INCONSISTENT
    };
  }else{
    let ret = changePwd(passWordMsg.username, newPwd);
    console.log('modify pwd ret:', ret);
    if(ret){
      res = {
        success: true,
        message: "密码修改成功,下次登录时请使用新密码。"
      };
    }else{
      res = {
        success: false,
        message: "密码修改失败。",
        errorcode: ErrorNo.ERROR_PWD_INCONSISTENT
      };
    }
  }

  ctx.response.body = res;
});

/* eslint no-param-reassign: ["error", { "props": false }]*/
router.post('/api/token', (ctx) => {
  ctx.body = {
    success: true,
    access_token: 'i am a test access_token',
  };
});

router.put('/api/userInfo', (ctx) => {
  ctx.body = 'this a users response!';
});

router.post('/api/logout', (ctx) => {
  const body = qs.parse(ctx.request.body);

  const response = {
    success: true,
    data: 'logged out!',
  };

  ctx.body = response;
});

router.use('/api/role', role.routes(), role.allowedMethods());
router.use('/api/user', users.routes(), users.allowedMethods());
router.use('/api/picolog', picolog.routes(), picolog.allowedMethods());
router.use('/api/uploadfile', uploadfile.routes(), uploadfile.allowedMethods());
router.use('/api/version-files', versionFiles.routes(), versionFiles.allowedMethods());


module.exports = router;
