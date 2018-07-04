/**
 * Created by xSoft on 2017-09-14.
 */
'use strict'
const fs = require('fs');
const Promise = require('bluebird');
import {config} from '../PicoCfg/config';

exports.readFileAsync = function(fpath,ecodnig){
  return new Promise(function(resolve,reject){
    fs.readFile(fpath,ecodnig,function(err,content){
      if(err){
        reject(err);
      }else{
        resolve(content);
      }
    });
  });
}

exports.writeFileAsync = function(fpath, content){
  return new Promise(function(resolve,reject){
    fs.writeFile(fpath,content,function(err, content){
      if(err){
        reject(err);
      }else{
        resolve();
      }
    });
  });
}

exports.accessCheck = function(){
  return config.accessCheck;
};
