const mysql = require("mysql");

const pool = mysql.createConnection({
    host:'localhost',
    user:'root', // mysql
    password:'checkhack__01',
    database:'homework'
});

module.exports = pool;


