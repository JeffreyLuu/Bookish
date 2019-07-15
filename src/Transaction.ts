import {Model, knex} from './databaseSetup';
Model.knex(knex);

export default class Transaction extends Model {
    static get tableName() {
        return 'transactions'
    }

    static get relationMappings() {
        const Copy = require('./Copy');
        const User = require('./User')
        return {
            copies: {
                relation: Model.HasManyRelation,
                modelClass: Copy,
                join: {
                    from: 'copies.id',
                    to: 'transactions.copy_id'
                }
            },
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'users.id',
                    to: 'transactions.user_id'
                }
            }
        }
    }
}
