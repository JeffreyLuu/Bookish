import express from "express";
import Book from "./model_book"
import Transaction from "./model_transaction"
import User from "./model_user"
import { resolve } from "url";
import path from 'path';
import { copyFile } from "fs";
import Sequelize from 'sequelize'
const sequelize = new Sequelize('postgres://bookish:SoftwireBookish@[::1]:5432/bookish')
const app = express();
const port =  3000;
var pgp = require('pg-promise')();
var db = pgp('postgres://bookish:SoftwireBookish@[::1]:5432/bookish')

const Book = sequelize.define('book', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isbn: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
  }, {
    freezeTableName: true
});

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
});

const Copy = sequelize.define('copies', {
  }, {
    freezeTableName: true
});

Copy.belongsTo(Book, {foreignKey: 'book_id', allowNull: false});
Copy.belongsTo(User, {foreignKey: 'user_id'});

const Transaction = sequelize.define('transactions', {
    date_borrowed: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
    date_returned: {
        type: Sequelize.DATEONLY
      },
    due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
}, {
  freezeTableName: true
});

Transaction.belongsTo(Copy, {foreignKey: 'copy_id', allowNull: false});
Transaction.belongsTo(User, {foreignKey: 'user_id', allowNull: false});

export async function getAllBooks () {
    
    let allBooks = await Book.findAll();
    try{
        let listOfBooks = [];
        for (let rawBook of allBooks){
            let book = new Book(rawBook.id, rawBook.name, rawBook.author, rawBook.isbn)
            listOfBooks.push(book)
        }
        return listOfBooks
    } catch (error) {
        console.log('ERROR:', error)
    }
    return allBooks;
}

export async function getUsers(username, password){
    let user = await User.findAll({
        where: {
          username: `${username}`
        }
      });
    
    try{
        return (user['password'] === password);
    } catch (error) {
        throw "Invalid username or password"
    }
}

async function getUserTransaction (username) {
    
    let user = await User.findAll({
        where: {
          username: `${username}`
        }
    });
    let user_id = user['id'];
    let userTransactions = await db.any(`SELECT * FROM public.transactions WHERE user_id = ${user_id}`);
    return userTransactions;
}

async function getBookName (copy_id) {
    
    let copy = await Copy.findAll({
        where: {
          copy_id: `${copy_id}`
        }
    });
    let book_id = copy.book_id
    let book = await Book.findAll({
        where: {
          book_id: `${book_id}`
        }
    });
    let book_name = book.name
    return book_name
}

export async function getUserCurrent (username) {
    let transactions = await getUserTransaction(username);
    let currentTransactions = [];
    for(let trans of transactions) {
        if(!trans['date_return']) {
            let book_name = await getBookName(trans['copy_id']);
            let transaction = new Transaction(book_name, trans['due_date'])
            currentTransactions.push(transaction);
        }
    }
    return currentTransactions
}