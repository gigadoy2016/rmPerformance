const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const {  conn,connection,dbConnection,HOSTIP } = require('../config/dbConfig');
const {  AssetCompany } = require('../classes/AssetCompany');
const {  Debug } = require('../classes/Debug');
let D = new Debug(true,"amc.js");

const bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  
const urlencodedParser = bodyParser.urlencoded({ extended: false });

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

//========================== Method Post ============================//

router.post('/uploadXLS', upload.single('file'),async(req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const xlsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const records = xlsData.map(item => [
      item["Fund Code"],
      item["Fund Name"],
      item["Fund Management"],
      item["Front End Fee (Selling fee)"],
      item["percentage"],
      new Date()
    ]);
  
    console.log("-------------------- Start ---------------");
  
    const sql = "INSERT INTO funds (fund_code, fund_name, amc_name, selling_fee, sharing, lastUpdate) VALUES ?";
    conn.query(sql, [records], (err, result) => {
      if (err) throw err;
      console.log(`Inserted ${result.affectedRows} records.`);
      res.status(200).json({"status":"ok"}); 
    });
    conn.end();
    console.log("-------------------- End -----------------");
  });

router.post('/listFund',async function(req, res, next) {
  D.debugLog(" >>>  Post /ListFund >>>> Line 55");
  let datas =await getAMC();
  res.status(200).json(datas);
});


router.post('/addSharing',async function(req, res, next) {
  D.debugLog(">>> Post addSharing >>>>>Line 63");
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  let sharing = req.body.sharing;
  const amc_id = req.body.amc_id;
  const amc_name=req.body.amc_name;
  const d = new Date();
  const date = moment(d).format('YYYY-MM-DD');
  const time = moment(d).format('YYYY-MM-DD HH:mm');
  const month = moment(d).format('MM');
  const year = moment(d).format('YYYY');
  // console.log(sharing);
  if(sharing !== undefined){
    sharing = sharing / 100;
  }


  let SQL_add = 'INSERT INTO `fund_sharing` (`amc_id`, `sharing`, `create_date`, `last_update`, `activated`, `fund_code`, `start_date`, `end_date`) ';
  SQL_add += 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  console.log(SQL_add);
  let data = [amc_id, sharing, date, time, '1',amc_name, startDate, endDate];
  // console.log(data);
  connection.query(SQL_add, data,(err, result) => {
    if(err){
      console.log(err);
    }else{
      console.log(result);
    }
  });

  res.status(200).json({'status':'OK','data':req.body});
});

//================== Method Get =================================//


router.get('/update', function(req, res, next) {
  D.debugLog("== amc.js update() ==");
  filepath = path.join(__dirname, '../public/uploads'); 
  //console.log(filepath);
  res.render('sellingFee', { title: 'Update' });
});

router.get('/list',async function (req, res) {
  D.debugLog(">>>> Session amc.js /list/");
  if(!req.session.isLoggedIn){
    // เมื่อไม่มี session แล้ว ให้กลับไปที่หน้า home
    console.log("session expired!!");
    res.redirect('/');
  }else{
    let user = req.session.user;
    let data =await getAMC();
    res.render('amc/amcList', { title: 'WCC',ipAPI: HOSTIP});
  }
});
// ============================= 82 ==================================================
router.get('/sharing/:id',async function(req, res, next) {
  D.debugLog("== amc.js /sharing == Line 82");
  let id = req.params.id;
  let SQL = "SELECT * FROM fund_sharing WHERE amc_id='"+id+"' ORDER BY start_date DESC;"
  console.log(SQL);
  let data = [];
  try{
    data =await dbConnection.query(SQL);
    // console.log(data[0]);
  }catch(e){
    D.debugLog(e);
  }
  res.status(200).send(data[0]);
});

// ==================================================================================
// เพิ่มความสามารถในการระบุวันสิ้นสุดโครงการณ์
// 
router.get('/sharing/month/:m/:y',async function(req, res, next) {
  D.debugLog("== amc.js /sharing ==");
  let m = req.params.m;
  let y = req.params.y;
  let date = y+'-'+m+'-01';
  
  let SQL = `SELECT ac.amc_id, ac.amc_name, ac.fund_code, as2.sharing, as2.promotion_start_date, 
  as2.promotion_end_date, as2.activated 
FROM funds AS ac LEFT JOIN fund_sharing AS as2 ON ac.fund_id = as2.amc_id  
WHERE 
  '${date}' BETWEEN as2.promotion_start_date AND COALESCE(as2.promotion_end_date, '${date}')
  AND as2.promotion_start_date IS NOT NULL 
  AND as2.activated = 1  
ORDER BY ac.fund_code, as2.promotion_start_date ASC;`;
  let data = [];
  try{
    D.debugLog(SQL);
    data =await dbConnection.query(SQL);
    // console.log(data[0]);
  }catch(e){
    D.debugLog(e);
  }
  res.status(200).send(data[0]);
});

router.get('/sharing2/month/:m/:y',async function(req, res, next) {
  D.debugLog("== amc.js /sharing2 ==");
  let m = req.params.m;
  let y = req.params.y;
  let SQL = "SELECT * FROM fund_sharing WHERE `month`='"+m+"' AND `year`='"+y+"';"
  let data = [];
  try{
    console.log(SQL);
    data =await dbConnection.query(SQL);
    // console.log(data[0]);
  }catch(e){
    D.debugLog(e);
  }
  res.status(200).send(data[0]);
});

router.get('/target/month/:m/:ic',async function(req, res, next) {
  D.debugLog("== amc.js /target ==");
  let m = req.params.m;
  let ic = req.params.ic;
  // let SQL = "SELECT * FROM user_target WHERE ic_code='"+ic+"' AND `month` <='"+m+"' order by `month` DESC;"
  let SQL = "SELECT * FROM user_target WHERE ic_code='"+ic+"' AND `month_active` <=STR_TO_DATE('"+m+"-01','%Y-%m-%d') order by `month_active` DESC;"
  let data = [];
  D.debugLog(SQL);
  try{
    data =await dbConnection.query(SQL);
    // console.log(data[0]);
  }catch(e){
    D.debugLog(e);
  }
  res.status(200).send(data[0]);
});




router.get('/test', function(req, res, next) {
  console.log("== amc.js test() ==");
  res.status(200).json({"status":"ok"});
});

async function getAMC(){
  D.debugLog("----------------");
  let SQL = "SELECT * FROM funds ";
  try{
    data =await dbConnection.query(SQL);
    // console.log(data[0]);
    return data[0];
  }catch(e){
    D.debugLog(e);
    return e;
  }
}
router.post('/fundcode',async function (req, res) {
  D.debugLog(">>>> Session amc.js /fundcode/");
  let fund_code = req.body.fundcode;
  let date = req.body.date;
  const fundcode = fund_code.map(code => `'${code}'`).join(', ');
  // console.log(fundcode);
  let SQL = `SELECT 
      ac.amc_id, ac.amc_name, ac.fund_code, as2.sharing, as2.promotion_start_date, 
      as2.promotion_end_date, as2.activated 
    FROM 
      funds AS ac LEFT JOIN fund_sharing AS as2 ON ac.fund_id = as2.amc_id 
    WHERE as2.fund_code IN (${fundcode}) AND 
      '${date}' BETWEEN as2.promotion_start_date AND COALESCE(as2.promotion_end_date, '${date}')
      AND as2.promotion_start_date IS NOT NULL 
      AND as2.activated = 1  
    ORDER BY ac.fund_code, as2.promotion_start_date ASC;`;
  
  try{
    // console.log(SQL);
    // D.debugLog(SQL);
    const [result] =await dbConnection.query(SQL);
    res.status(200).send({'fundcode':fund_code,'sharing':result});
  }catch(e){
    D.debugLog(e);
    res.status(200).send({'status':e});
  }
  
});


router.get('/updateNew', function(req, res) {
  D.debugLog("== amc.js updateNew() ==");
  res.render('./amc/update', { title: 'Update' });
});

router.post('/updateNew', urlencodedParser, function(req, res) {
  D.debugLog("== amc.js updateNew() ==");
  let fund_code = req.body.fundcode;
  let create_date = req.body.createDate;
  
  console.log(fund_code);
  res.status(200).json({'status':'OK','data':req.body});
});


module.exports = router;