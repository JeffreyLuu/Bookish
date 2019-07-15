export const { Model } = require('objection');
const Knex = require('knex');


export const knex = Knex({
    client: 'pg',
    connection: {
    //   host : '[::1]',
      user : 'bookish',
      password : 'SoftwireBookish',
      database : 'bookish'
    }
});

