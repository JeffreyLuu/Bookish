import {Model, knex} from './databaseSetup';
Model.knex(knex);

export default class Copy extends Model {
    static get tableName() {
        return 'copies'
    }

    static get relationMappings() {
        const Book = require('./Book');
        const User = require('./User')
        return {
            book: {
                relation: Model.HasManyRelation,
                modelClass: Book,
                join: {
                    from: 'book.id',
                    to: 'copies.book_id'
                }
            },
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'users.id',
                    to: 'copies.user_id'
                }
            },
        }
    }

    // static get jsonSchema () {
    //     return {
            
    //     }
    // }
}
