/**
 * Created by xSoft on 2018-05-09.
 */

//https://www.rapiddg.com/blog/calling-rest-api-nodejs-script
//https://www.npmjs.com/package/node-rest-client
//https://github.com/request/request
//https://github.com/strongloop/strong-soap
//https://github.com/danwrong/restler


// const Client = require('node-rest-client').Client;
// let client = new Client();
// let qqOnlineUrl = 'http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx/qqCheckOnline?qqCode=56756121';
// let testGet = function(){
//   client.get(qqOnlineUrl, function (data, response){
//     console.log(data);
//     // raw response
//     console.log(response);
//   });
// }

const http = require('http');
const qs = require('querystring');
var request = require('request');
/////restler
const rest = require('restler');

const sleep = require('sleep');

import {config} from '../PicoCfg/config';

import {knex} from '../db/knexmgr';

const Group = require('../db/qgroup/group');
const User = require('../db/qgroup/user');


let group = new Group(knex);
let user = new User(knex);
//deviceNumSocketMap.set(terminalId, socketId);

function getBkn(skey) {
    for (var b = skey, a = 5381, c = 0, d = b.length; c < d; ++c) {
        a += (a << 5) + b.charAt(c).charCodeAt();
    }
    return a & 2147483647;
}

function formatString(s) {
    //return s.replace(/&nbsp;/g, ' ').replace(/[^\w\d\s\[\]\{\}\,.?"\(\)+_\-*\/\\&\$#^@!~`\u4E00-\u9FA5\uf900-\ufa2d]/g, '');
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    return s.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

let httpGetGroup = function(cookies){
    var skey = /skey=(.+?);/.test(cookies) && RegExp.$1;
    var qq =  /uin=o0*(\d+)?/.test(cookies) && RegExp.$1;
    var bkn = getBkn(skey);

    let reqOptions = {
        url: 'http://qun.qq.com/cgi-bin/qun_mgr/get_group_list?bkn=' + bkn,
        headers: {
            'Cookie': cookies
        }
    };

    console.log('reqOptions', reqOptions);

    let req = request(reqOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //body = JSON.parse(body);
            //console.log('group body', body);
            console.log('1111');
            if(body.create != undefined){
              let created = body.create;
                console.log('2222', created.size);
              for(let i=0; i<created.size; i++){
                let groupInfo = {
                  number: created[i].gc,
                  name: created[i].gn,
                  owner: created[i].owner
                };
                //console.log(groupInfo);
              }
            }

        } else {
            console.log('group error', error);
        }
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
};

 async function restlerGetGroup(cookies) {
    var skey = /skey=(.+?);/.test(cookies) && RegExp.$1;
    var qq =  /uin=o0*(\d+)?/.test(cookies) && RegExp.$1;
    var bkn = getBkn(skey);
    let reqOptions = {
        url: 'http://qun.qq.com/cgi-bin/qun_mgr/get_group_list?bkn=' + bkn,
        headers: {
            'Cookie': cookies
        }
    };

     rest.get(reqOptions.url, reqOptions).on('complete', async function (data) {
        let result = JSON.parse(data);
        //console.log('result', result);
        let groupArray = new Array();
        if(result.create != undefined){
            let created = result.create;
            for(let i=0; i<created.length; i++){
                let groupInfo = {
                    number: created[i].gc,
                    name: formatString(created[i].gn),
                    owner: created[i].owner
                };
                //console.log(groupInfo);
                await addGroupToDb(groupInfo);
                groupArray.push(groupInfo);
                //sleep.msleep(300);
            }
        }
        if(result.manage != undefined){
            let manage = result.manage;
            for(let i=0; i<manage.length; i++){
                let groupInfo = {
                    number: manage[i].gc,
                    name: formatString(manage[i].gn),
                    owner: manage[i].owner
                };
                //console.log(groupInfo);
                groupArray.push(groupInfo);
                await addGroupToDb(groupInfo);
                //sleep.msleep(300);
            }
        }
        if(result.join != undefined){
            let join = result.join;
            for(let i=0; i<join.length; i++){
                let groupInfo = {
                    number: join[i].gc,
                    name: formatString(join[i].gn),
                    owner: join[i].owner
                };
                //console.log(groupInfo);
                await addGroupToDb(groupInfo);
                groupArray.push(groupInfo);
                //sleep.msleep(300);
            }
        }

        //addGroupToDb(groupArray);
    }).on('success', function (data) {
        //console.log('success', data);
    }).on('fail', function(data){
        console.log('fail', data);
    }).on('error', function (err) {
        console.log('err', data);
    }).on('abort', function(){
        console.log('abort');
    }).on('timeout', function (ms) {
        console.log('timeout', ms);
    });
}

 async function addGroupToDb(groupInfo){
   // console.log('group len', groupInfo.length);
   // let groupArray = new Array();
   //  let len = groupInfo.length;
   // for(let i=0; i<len; i++){
   //   groupArray.push(groupInfo[i]);
   //   if(groupArray.length>=50){
   //       await addGroup(groupArray);
   //       //groupArray.shift();
   //       groupArray.splice(0,groupArray.length);//清空数组
   //       sleep.msleep(50);
   //       console.log('groupArray', groupArray.length);
   //   }
   // }
   //  console.log('groupArray', groupArray.length);
  let res = await group.addGroup(groupInfo);
  // if(res.success){
  //     groupMap.set(groupInfo.number,{
  //       id: res.id,
  //       status: 0,
  //     })
  // };
  return res;
}

async function httpGetUser(cookies, groupNumber){
    let res = null;
    var skey = /skey=(.+?);/.test(cookies) && RegExp.$1;
    var qq =  /uin=o0*(\d+)?/.test(cookies) && RegExp.$1;
    var bkn = getBkn(skey);
    var params = 'bkn=' + bkn + '&gc=' + groupNumber + '&st=0&end=2000&sort=0';
    let reqOptions = {
        url: 'http://qun.qq.com/cgi-bin/qun_mgr/search_group_members?' + params,
        headers: {
            'Cookie': cookies
        }
    };

    return new Promise(function(resolve, reject){
        request(reqOptions, async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                //console.log('response ', body);
                body = JSON.parse(body);
                res = body.mems;
                //console.log('user body', body.mems);
                resolve(res);

            } else {
                console.log('httpGetUser error', error);
                reject(error);
            }
        });
    });

/*
    console.log('1111111');
    let req = await request(reqOptions, async function (error, response, body) {
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body);
            res = body.mems;
            console.log('user body', body.mems);


        } else {
            console.log('httpGetUser error', error);
        }
    });

    console.log('22222222');
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();

    console.log('33333333');
    return res;
    */
}

async function restlerGetUser(cookies, groupNumber){
  console.log('restlerGetUser', groupNumber);

    let usersArray = new Array();
    var skey = /skey=(.+?);/.test(cookies) && RegExp.$1;
    var qq =  /uin=o0*(\d+)?/.test(cookies) && RegExp.$1;
    var bkn = getBkn(skey);
    var params = 'bkn=' + bkn + '&gc=' + groupNumber + '&st=0&end=2000&sort=0';
    let reqOptions = {
        url: 'http://qun.qq.com/cgi-bin/qun_mgr/search_group_members?' + params,
        headers: {
            'Cookie': cookies
        }
    };

    await  rest.get(reqOptions.url, reqOptions).on('complete', function (data) {
        console.log('111111111111111111');
        let result = JSON.parse(data);
        if(result.mems != undefined){
          let users = result.mems;
          let len = users.length;
          for(let i=0; i<len; i++){
            let info = users[i];
            let user = {
                number: info.uin,
                name: formatString(info.nick),
                card: formatString(info.card),
                age: info.qage,
                sex: info.g,
                role: info.role,
                join_time: info.join_time,
                last_speak_time: info.last_speak_time,
            };
              usersArray.push(user);
            //console.log('user', user);
          }
        }


    }).on('success', function (data) {
        //console.log('success', data);
    }).on('fail', function(data){
        console.log('fail', data);
    }).on('error', function (err) {
        console.log('err', data);
    }).on('abort', function(){
      console.log('abort');
    }).on('timeout', function (ms) {
        console.log('timeout', ms);
    });

    console.log('7777777777777');
    return usersArray;
};


 let groups = new Array();

 async function getAllGroup(){
    groups.splice(0,groups.length);
   let res = await group.queryGroup({field:'status', keyword:'0'});
    groups = res.data;
   console.log('getAllGroup length:', groups.length);
    await getAllGroupUsers();
    console.log('222222222222');
}

async function getAllGroupUsers(){
   let len = groups.length;
   for(let i=0; i<len; i++){
     let groupInfo = groups[i];
     let users = await httpGetUser(config.cookie, groupInfo.number);
     console.log('getAllGroupUsers', groupInfo.id, groupInfo.number);
     let userLen  = users.length;
     let usersArray = new Array();
     for(let i=0; i<userLen; i++){
        let info = users[i];

        let userInfo = {
            group_id: groupInfo.id,
            number: info.uin,
            name: formatString(info.nick),
            card: formatString(info.card),
            age: info.qage,
            sex: info.g,
            role: info.role,
            join_time: info.join_time,
            last_speak_time: info.last_speak_time,
        };
        usersArray.push(userInfo);

         await user.addUser(userInfo);
        // if(usersArray.length>=50){
        //     await user.addUser(usersArray);
        //     usersArray.splice(0,usersArray.length);
        //     console.log('i', i, usersArray.length);
        //     sleep.msleep(50);
        // }
     };
     //await user.addUser(usersArray);
     await group.updateGroupStatus(groupInfo.number, 1);
     //console.log('getAllGroupUsers', users);
     //break;
   }
    console.log('8888888888888888');
 }




export{
    httpGetGroup,
    restlerGetGroup,
    restlerGetUser,
    getAllGroup,
};
