import express from "express";
import Book from "./model_book"
import Transaction from "./model_transaction"
import User from "./model_user"
import { resolve } from "url";
import path from 'path';
import { copyFile } from "fs";
const app = express();
const port =  3000;
var pgp = require('pg-promise')();
var db = pgp('postgres://bookish:SoftwireBookish@[::1]:5432/bookish')


export async function getAllBooks () {
    
    let allBooks = await db.any('SELECT * FROM public.book');
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
    let user = await db.one(`SELECT * FROM public.users WHERE username = '${username}';`);
    
    try{
        return (user['password'] === password);
    } catch (error) {
        throw "Invalid username or password"
    }
}

async function getUserTransaction (username) {
    
    let user = await db.one(`SELECT * FROM public.users WHERE username = '${username}'`);
    let user_id = user['id'];
    let userTransactions = await db.any(`SELECT * FROM public.transactions WHERE user_id = ${user_id}`);
    return userTransactions;
}

async function getBookName (copy_id) {
    
    let copy = await db.one(`SELECT * FROM public.copies WHERE id = '${copy_id}'`);
    let book_id = copy.book_id
    let book = await db.one(`SELECT * FROM public.book WHERE id = '${book_id}'`);
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