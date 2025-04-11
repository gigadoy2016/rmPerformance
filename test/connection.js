const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2');
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;

console.log(DB_HOST);
console.log(DB_USER);
console.log(DB_PASSWORD);
console.log(DB_DATABASE_NAME);

// กำหนดค่าการเชื่อมต่อ
const connection = mysql.createConnection({
  host: DB_HOST,      // หรือ IP ของ server
  user: DB_USER,           // ชื่อผู้ใช้ MySQL
  password: DB_PASSWORD,  // รหัสผ่าน
  database: DB_DATABASE_NAME   // ชื่อ database ที่จะเชื่อม
});

// ทำการเชื่อมต่อ
connection.connect((err) => {
  if (err) {
    console.error('เชื่อมต่อไม่สำเร็จ:', err.message);
    return;
  }
  console.log('เชื่อมต่อ MySQL สำเร็จ!');
  
  // ทดสอบ query อะไรเบาๆ
  connection.query('SELECT NOW() AS now', (err, results) => {
    if (err) {
      console.error('Query ผิดพลาด:', err.message);
    } else {
      console.log('เวลาปัจจุบันจาก MySQL:', results[0].now);
    }

    // ปิด connection
    connection.end();
  });
});
