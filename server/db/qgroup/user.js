/**
 * Created by xSoft on 2017-07-19.
 */
import {knex} from '../knexmgr';


class User{
  // 构造
    constructor(knex) {
      this.knex = knex;
    }

    async  addUser(user){
    let res = null;
    await this.knex('user')
        .insert(user)
        .then( (result) => {
          res = {
              success: true,
          }
        })
        .catch( (error) => {
                console.log('addUser error:', error);
            if(JSON.stringify(error).indexOf('ORA-03114')>0){
                knex.destroy();
            }
            res = {
                success: false,
                message: error,
            }
        });

      if(res === null){
          res = {
              success: true,
          };
      }

      return res;
    }

    async  queryUser(params){
    let res = null;

    let conditions = {
        field: 'id',
        operator: '>',
        keyword: '0',
    };

    if(params.field === 'sex'){
        conditions.field = 'sex';
        conditions.operator = '=';
        conditions.keyword = params.keyword;
    }else if(params.field === 'group_id'){
        conditions.field = 'group_id';
        conditions.operator = '=';
        conditions.keyword = params.keyword;
    }else if(params.field === 'role'){
        conditions.field = 'role';
        conditions.operator = '=';
        conditions.keyword = params.keyword;
    }

    await this.knex.select('*')
        .from('user')
        .where(conditions.field, conditions.operator, conditions.keyword)
        .orderBy('id', 'desc')
        .then( (result) => {
          res = {
              success: true,
              data: result,
          }
        })
        .catch( (error) => {
                console.log('queryUser error:', error);
            if(JSON.stringify(error).indexOf('ORA-03114')>0){
                knex.destroy();
            }
            res = {
                success: false,
                message: error,
            };
        });

          if(res === null){
              res = {
                  success: true,
              };
          }
        return res;
      }
}

module.exports = User;
