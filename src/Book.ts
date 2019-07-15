import {Model, knex} from './databaseSetup';
Model.knex(knex);


export default class Book extends Model {
    static get tableName() {
        return 'book'
    }
}





