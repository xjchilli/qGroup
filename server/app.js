const Koa = require('koa');
const router = require('koa-router')();
const cors = require('kcors');
const convert = require('koa-convert');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const favicon = require('koa-favicon');

const app = new Koa();
const index = require('./routes/index');
const api = require('./routes/api_v1');

const os = require('os');

const utils = require('./utils/utils');

const fs  = require('fs');

import {initMenuPrivilege} from './db/account/role';
import {mkdirVersionFilesPath} from './routes/uploadfile';

import {config} from './PicoCfg/config';
import {
    httpGetGroup,
    restlerGetGroup,
    restlerGetUser,
    getAllGroup,
} from './service/webservice';


// middlewares
app.use(favicon(`${__dirname}/../dist/favicon.ico`));
app.use(cors({ origin: '*' }));
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));


app.use(require('koa-static')(`${__dirname}/../dist`));

//router.use('/', index.routes(), index.allowedMethods());
//router.use('/api/v1', api.routes(), api.allowedMethods());

//app.use(router.routes(), router.allowedMethods());

app.on('error', (err, ctx) => {
//  logger.error('server error', err, ctx);
  console.log('server error', err, ctx);
});

//mkdirVersionFilesPath();

//httpGetGroup(config.cookie);


 function test(){
    restlerGetGroup(config.cookie);
  //await  restlerGetUser(config.cookie,'293732006');
}

getAllGroup();

//test();

module.exports = app;
