//const mysql = require('mysql2/promise');
const mysql = require('mysql2');
const HOSTIP = '54.179.9.117:3000';
const module_incentive = 'ON';

// const connection = mysql.createPool({
//     host     : '192.168.68.101',
//     user     : 'devoop',
//     password : 'O225o7907@wcc',
//     database : 'dipchip'
// });
const connection = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'rangsan',
    password : 'O225o7907',
    database : 'wcc'
});
const conn = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'rangsan',
    password : 'O225o7907',
    database : 'wcc'
});
const dbConnection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'rangsan',
  password : 'O225o7907',
  database : 'wcc'
}).promise();

module.exports = { connection,conn,dbConnection,HOSTIP }
