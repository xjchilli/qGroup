/**
 * Created by xSoft on 2017-07-19.
 */
//import {knex} from '../knexmgr';
var Promise = require('bluebird');

class Group{
    // 构造
      constructor(knex) {
        this.knex = knex;
      }

    async  addGroup(group){
    let res = null;

    await this.knex('group')
        .insert(group)
        .then( (result) => {
            res = {
                success: true,
            }
        })
        .catch( (error) => {
                console.log('addGroup error:', error);
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
    /*
     knex.transaction(async function(trx) {
     await knex('group')
     .transacting(trx)
     .insert(group)
     .then(trx.commit)
     .catch(trx.tollback);
     })
     .then(function(result){
     console.log('result:', result)
     })
     .catch(function(err){
     console.log('err', err);
     });
     */


    /*
     // let connection = await knex.client.acquireConnection();
     try{
     await knex('group')
     .transacting(trx)
     .insert(group)
     .then( (result) => {
     res = {
     success: true,
     }
     })
     .catch( (error) => {
     console.log('addGroup error:', error);
     if(JSON.stringify(error).indexOf('ORA-03114')>0){
     knex.destroy();
     }
     res = {
     success: false,
     message: error,
     }
     });
     }finally {
     // console.log('close connection');
     // knex.client.releaseConnection(connection);
     }

     //console.log('2222222222222');
     if(res === null){
     res = {
     success: false,
     message: 'unknown error',
     };
     }
     */
        return res;
    }

    async updateGroupStatus(number, status){
    let res = null;

    await this.knex('group').where('number', number)
        .update({status: status})
        .then( (result) => {
            })
        .catch( (error) => {
                console.log('updateGroupStatus error:', error);
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

    async  queryGroup(params){
    let res = null;
    let conditions = {
        field: 'id',
        operator: '>',
        keyword: '0',
    };

    if(params.field === 'status'){
        conditions.field = 'status';
        conditions.operator = '=';
        conditions.keyword = params.keyword;
    }else if(params.field === 'number'){
        conditions.field = 'number';
        conditions.operator = '=';
        conditions.keyword = params.keyword;
    }

    await this.knex.select('*')
        .from('group')
        .where(conditions.field, conditions.operator, conditions.keyword)
        .orderBy('id', 'desc')
        .then( (result) => {
            res = {
                success: true,
                data: result,
            }
        })
        .catch( (error) => {
                console.log('queryGroup error:', error);
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


module.exports = Group;
