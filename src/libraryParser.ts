import express from "express";
import BookClass from "./model_book"
import TransactionClass from "./model_transaction"
import Book from "./Book";
import Copy from "./Copy";
import Transaction from "./Transaction";
import User from "./User";
import { resolve } from "url";
import path from 'path';
import { copyFile } from "fs";


const app = express();
const port =  3000;


export async function getAllBooks () {
    
  let allBooks = await Book
    .query()
    .orderBy('name')
  try{
    let listOfBooks = [];
    for (let rawBook of allBooks){
        let book = new BookClass(rawBook.id, rawBook.name, rawBook.author, rawBook.isbn)
        listOfBooks.push(book)
    }
    return listOfBooks
  } catch (error) {
    console.log('ERROR:', error)
  }
  return allBooks;
}

export async function getUsers(username, password){
    let user = await User
      .query()
      .where('username', username)

    try{
        return (user[0]['password'] === password);
    } catch (error) {
        throw "Invalid username or password"
    }
}

async function getUserTransaction (username) {
    
    let user = await User
      .query()
      .where('username', username)

    let user_id = user[0]['id'];
    let userTransactions = await Transaction
      .query()
      .where('user_id', user_id)
    return userTransactions;
}

async function getBookName (copy_id) {
    
    let copy = await Copy
      .query()
      .where('id', copy_id)

    let book_id = copy[0].book_id
    let book = await Book
      .query()
      .where('id', book_id)
    let book_name = book[0].name
    return book_name
}

export async function getUserCurrent (username) {
    let transactions = await getUserTransaction(username);
    let currentTransactions = [];
    for(let trans of transactions) {
        if(!trans['date_return']) {
            let book_name = await getBookName(trans['copy_id']);
            let transaction = new TransactionClass(book_name, trans['due_date'])
            currentTransactions.push(transaction);
        }
    }
    return currentTransactions
}