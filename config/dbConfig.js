
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql2');
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE_NAME;

const HOSTIP = process.env.HOSTIP+":"+process.env.SERVER_PORT;
const connection = mysql.createPool({
    host     : DB_HOST,
    user     : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE
});
const conn = mysql.createConnection({
    host     : DB_HOST,
    user     : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE
});
const dbConnection = mysql.createConnection({
    host     : DB_HOST,
    user     : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE,
    timezone: 'Z'
}).promise();
// const dbConnJob = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '9161133',
//     database : 'wcc_intra'
// }).promise();

// const dbConnFCC = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '9161133',
//     database : 'wcc_fundconnext'
// }).promise();


// const mailLogin = {
//   service: 'gmail',
//   auth: {
//     user: 'wealthconcept.th@gmail.com',
//     pass: 'tphl ambg pqmn uiwe'
//   }
// };

module.exports = { connection,conn,dbConnection,dbConnJob,dbConnFCC,HOSTIP,mailLogin }
