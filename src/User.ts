import {Model, knex} from './databaseSetup';
Model.knex(knex);


export default class User extends Model {
    static get tableName() {
        return 'users'
    }
}
