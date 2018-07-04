/**
 * Created by xSoft on 2017-07-12.
 */

import {config} from '../PicoCfg/config';

const sqliteCfg = {
  client: 'sqlite3',
  connection: {
    filename: config.dbPath,
  },
  pool: { min: 4, max: 128 },
  useNullAsDefault: true,
  acquireConnectionTimeout: 60000,

};

module.exports.sqliteCfg = sqliteCfg;

