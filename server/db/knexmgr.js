/**
 * Created by xSoft on 2017-07-12.
 */

//const config = require('./config.js');
const Knex = require('knex');

import {
    sqliteCfg,
  } from './config';

let knex = null;


if(knex==null){
    knex = Knex(sqliteCfg);
}

const knexConn = knex('group').where('id', 1);
//const knex = Knex(config);
module.exports.knex = knex;
module.exports.knexConn = knexConn;
