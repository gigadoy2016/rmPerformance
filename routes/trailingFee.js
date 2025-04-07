const express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const {  conn,HOSTIP } = require('../config/dbConfig');
const {  Debug } = require('../classes/Debug');
const D = new Debug(true,"trailingFee.js");
const router = express.Router();

//const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/fee');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
    res.send({'status':"ok"});
});

router.get('/update', function(req, res, next) {
    res.render('employee/trailingFee',{'title':"Trailing Fee"});
});
router.get('/upload', function(req, res, next) {
  res.render('fee/uploadFee',{'title':"Trailing Fee Update"});
});
router.get('/wcctrailing', function(req, res, next) {
  res.render('fee/readXlsx',{'title':"Trailing Fee Update"});
});



router.post('/updated', upload.single('file'),async (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const xlsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const dateS = req.body.st_date;
    await insertData(xlsData,res,dateS);
});
router.post('/uploadTrailing', function(req, res, next) {
    D.Log("---- Method POST ----");
    let trailing = req.body.trailing;
    let dateActive = req.body.date;
    insertData3(trailing,res,dateActive);
    // res.status(200).json({"updated":"OK"});
});


function insertData(datas,res,dateS){
    let date = new Date(dateS);
    let d_active = date.getFullYear()+"-"+(date.getMonth()+1)+"-1";
    const records = datas.map(item => [
        item["ic_code"],
        item["Trailng"],
        item["month"],
        dateS,'0000',
        d_active
      ]);
    console.log(records);
    console.log("-------------------- Start Update---------------");
    const sql = "INSERT INTO trailingFee (employee_id, rmTrailingFee, month,updated, updater,month_active) VALUES ?";
    try{
      conn.query(sql, [records], (err, result) => {
        if (err) throw err;
        console.log(`Inserted ${result.affectedRows} records.`);  
      });
      conn.end();
      console.log("-------------------- End -----------------");
      res.status(200).json({"updated":"OK"});
    }catch (err){
      console.log(err);
      res.status(200).json({"status":"Fail"});
    }
}
function insertData2(datas,res,dateS){
  let date = new Date();
  let d_active = date.getFullYear()+"-"+(date.getMonth()+1)+"-1";
  const records = datas.map(item => [
      item["IC"],
      item["RM"],
      item["WCC"],
      date,
      '0000',
      d_active
    ]);
  console.log(records);
  console.log("-------------------- Start Update---------------");
  const sql = "INSERT INTO trailingFee (employee_id, rmTrailingFee, wccTrailingFee, updated, updater,month_active) VALUES ?";
  try{
    conn.query(sql, [records], (err, result) => {
      if (err) throw err;
      console.log(`Inserted ${result.affectedRows} records.`);  
    });
    conn.end();
    console.log("-------------------- End -----------------");
    res.status(200).json({"updated":"OK"});
  }catch (err){
    console.log(err);
    res.status(200).json({"status":"Fail"});
  }
}
function insertData3(datas,res,d_active){
  console.log("------------------------insertData3------------------------------");
  let date = new Date();
  // let d_active = date.getFullYear()+"-"+(date.getMonth()+1)+"-1";
  const records = datas
    .filter(item => item["IC"])
    .map(item => [
      item["IC"],
      item["RM"],
      item["WCC"],
      date,
      '0000',
      d_active
    ]);
  console.log(records);
  console.log("-------------------- Start Update---------------");
  const sql = "INSERT INTO trailingFee (employee_id, rmTrailingFee, wccTrailingFee, updated, updater,month_active) VALUES ?";
  try{
    conn.query(sql, [records], (err, result) => {
      if (err) throw err;
      console.log(`Inserted ${result.affectedRows} records.`);  
    });
    conn.end();
    console.log("-------------------- End -----------------");
    res.status(200).json({"updated":"OK"});
  }catch (err){
    console.log(err);
    res.status(400).json({"status":"Fail"});
  }
}

module.exports = router