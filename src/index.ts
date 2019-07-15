import express from "express";
import { resolve } from "url";
import jwt from "jsonwebtoken"
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
import path from 'path';
const app = express();
const port =  3000;
const pgp = require('pg-promise')();
const db = pgp('postgres://bookish:SoftwireBookish@[::1]:5432/bookish')
import {getAllBooks, getUsers, getUserCurrent} from "./libraryParser"
import passport from 'passport';
const secret = 'icecream'
// const cookieParser = require('cookie-parser');

// app.use(cookieParser)

// const cookieExtractor = function(req) {
//     var token = 'a';
//     console.log(token);
//     if (req && req.cookies)
//     {
//         token = req.cookies['jwt'];

//     }
//     console.log(req.cookies);
//     return token;
// };

const opts = {   
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

app.use('/login', express.static(path.join(__dirname, 'frontend')));
app.get('/login', passport.authenticate('jwt'))

async function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login')
    }
}


passport.use(new JwtStrategy(opts, async function(jwtPayload, done){
    try{
        const validUser = await getUsers(jwtPayload.username, jwtPayload.password);
        if (validUser) {
            return done(null, jwtPayload.username)
        }
        else {
            return done(null, false)
        }
    }catch (err){ 
        return done(err)
    }
}));

//app.use('/Books', passport.authenticate('jwt', { session: false }))
app.use('/Books', passport.authenticate('jwt', { session: false }), express.static(path.join(__dirname, 'frontend/books.html')));

app.use('/User', express.static(path.join(__dirname, 'frontend/user.html')));

app.get('/GettingAllBooks', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const jsonBookOutput = await getAllBooks();
    res.send(jsonBookOutput);
});

app.get('/GettingUser', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let username = await req.query.username;
    console.log(username);
    const UserTransactions = await getUserCurrent(username);
    
    res.send(UserTransactions);
});;

app.post('/CheckingDetails', async (req, res) => {
    let username = await req.query.username;
    let password = await req.query.password;
    let jwtPayload = {username: username, password: password};
    const validUser = await getUsers(jwtPayload.username, jwtPayload.password);
    if(validUser) {
        let token = jwt.sign({ username: username, password: password}, secret);
        res.status(200).send({token: token, username: username});
    }
    else {
        res.status(400).send({message:'Username or password incorrect.'});
    }

})

app.listen(port, () => console.log('Bookish app listening on port ' + port + '!'));