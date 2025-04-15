/**
 *  issue : method read xls to json ข้อมูลมาไม่ครบ
 *   - Basket Transaction ID
 *   - Pay-in Bank	
 *   - Pay-in Bank Account
 *   - Team
 *   - Auto Redeem Fund Code,AMC Switching Order Reference No,XWT Reference No,Counter AMC Code,Counter Fund Code,Counter Unitholder ID,XWT Remark
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const {  connection,dbConnection,HOSTIP,dbConnFCC } = require('../config/dbConfig');
const {  Transaction } = require('../classes/Transaction');
const {  TranQuery } = require('../classes/TranQuery');
const {  txtLog,debugLog } = require('../config/log');

const bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  
const urlencodedParser = bodyParser.urlencoded({ extended: false });


//const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage: storage });



//====== 
router.post('/uploadXLS', upload.single('file'),(req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const startDate = req.body.st_date.split(" ");
  const endDate = req.body.ed_date.split(" ");
  //Delete transaction
  const delSQL = "DELETE FROM transactions WHERE transaction_date BETWEEN  STR_TO_DATE('"+startDate[0]+" 00:01','%d/%m/%Y %H:%i') AND STR_TO_DATE('"+endDate[0]+" 23:59','%d/%m/%Y %H:%i')";

  connection.query(delSQL, function (err, result) {
    let display = JSON.stringify(result);
    // console.log(display);
    if (err) {
      res.status(500).send(err); 
    }else{
      //Update section
      const sheet_name_list = workbook.SheetNames;
      const xlsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      //let result = await insert(xlsData,res);
      //res.json(xlsData);
      // res.status(200).send(xlsData);

      let tran = new TranQuery(xlsData);
      sqlInsert= tran.genSqlInsert();

      // console.log("-------------------- Start ---------------");
      txtLog("uploadXLS",sqlInsert);

      connection.query(sqlInsert, function (err, result) {
          if (err) {
            res.status(500).send(err); 
          }else{            
            display ="Delete:"+display+ "<br>INSERT:"+JSON.stringify(result);
            txtLog("transaction.js",display);
            res.status(200).send(display);
          }
      });
      // console.log("-------------------- End ---------------");
    }
  });
  // res.status(200).send(delSQL)
});

//====== 
router.post('/allotted', upload.single('file'),(req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet_name_list = workbook.SheetNames;
  const xlsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  let tran = new TranQuery(xlsData);
  let sqlUpdated= tran.genSqlUpdate();
  // console.log("-------------------- Start ---------------");
  // console.log(sqlUpdated);
  connection.query(sqlUpdated, function (err, result) {
      if (err) {
        res.status(500).send(err); 
      }else{
        res.status(200).send(result);
      }
  });
  // console.log("-------------------- End ---------------");
});

const ifNotLoggedIn =(req,res,next)=>{
    if(!req.session.isLoggedIn){
      return res.render('login');
    }
    next();
}

//----------------------------------------------------- Get Session  method route --------------------
router.get('/list', (req, res, next) => {
  console.log(">>>> Session transantion.js /list/");
  if(!req.session.isLoggedIn){
    console.log("session expired!!");
    res.redirect('/');
  }else{
    let user = req.session.user;
    // console.log(user);
    res.status(200).render('tranForm'
      , { 
        "data": user,
        "name":user.name_eng+" "+user.lastname_eng,
        "permission":user.permission,
        "ipAPI":HOSTIP
       });
  }
});

// เมื่้อเข้ามาที่หน้าแรก path: "/". 
router.get('/',async function(req, res, next) {
  console.log("---QUERY data");
  try{
    let customers = new Transaction();
    res.send(await customers.query());
  }catch (err) {
    console.error(err);
    res.send(err);
  }
});

router.get('/update', function(req, res, next) {
    console.log("== transactions.js update() ==");
    filepath = path.join(__dirname, '../uploads');
    //console.log(filepath);
    res.render('./transaction/transUpload', { title: 'Update' });
});

router.get('/updateAllotted', (req, res, next) => {
  res.render('updateTransAllot', { title: 'Update Allotted' });
});

//------------------------------------------------------- POST session method route --------------------
router.post('/list', urlencodedParser,async function (req, res) {  
  // Prepare output in JSON format  
  if(!req.session.isLoggedIn){
    console.log("session expired!!");
    res.redirect('/');
  }else{
    let user = req.session.user;
    res.status(200).render('tranForm'
      , { 
        "data": user,
        "name":user.name_eng+" "+user.lastname_eng,
        "permission":user.permission,
        "ipAPI":HOSTIP
       });
  }
  console.log("transaction list:===================");
  res.status(200).render('tranForm', { 'title': employee,'ipAPI': HOSTIP});
});

// =========================================== Allotment =================
router.get('/allotment',async (req, res) => {
  console.log(">>>> Session transantion.js /Allotment/");
  // Prepare output in JSON format  
  if(!req.session.isLoggedIn){
    console.log("session expired!!");
    res.redirect('/');
  }else{
    let user = req.session.user;
    res.status(200).render('transaction/transactionAllotment'
      , { 
        "data": user,
        "name":user.name_eng+" "+user.lastname_eng,
        "permission":user.permission,
        "ipAPI":HOSTIP
       });
  }
});

//============================  API Session =======================

router.post('/select', urlencodedParser,async function (req, res) { 
  console.log("==== select==================================================6=");
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let employee = req.body.employee;

  //console.log(req.body);
  if(employee !== undefined){
    let emp = employee.split(" ");
    let ic_code = emp[0];
    let query = new TranQuery();
    let sql =query.getTransactions(ic_code,startDate,endDate);

    const _date = new Date(startDate);
    const month = _date.getMonth()+1;
    const year = _date.getFullYear();
    
    const [user, trailing_fee, incentive, salary] = await Promise.all([
      getEmployeeByID(ic_code),
      getTrailingFee(ic_code, month, year),
      getInsentive(ic_code, `${year}-${month}-01`),
      getSalaryRM(ic_code, `${year}-${month}-01`)
    ]);
    console.log(user);
    console.log("9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(trailing_fee);
    console.log("9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    let data = {'user':user[0],'trans':[]};
    if(trailing_fee.rmTrailingFee != undefined){
      data.user.trailing_fee = trailing_fee.rmTrailingFee;
      data.user.trailing = {
        trailing_fee: trailing_fee.rmTrailingFee, 
        wccTrailing_fee: trailing_fee.wccTrailingFee,
        date:trailing_fee.updated,
        updater:trailing_fee.updater
      };
    }
    console.log("salary======================================");
    console.log(salary);
    if(salary != null){
      if(salary.length>0)
        data.user.salary = salary;
    }
    if(incentive != null){      
      data.user.incentive = incentive;
    }
    // console.log("----------------------------------------------------trailing_fee:"+data.user.trailing_fee);
    // console.log(data);
    connection.query(sql,async function (err, result) {
      if (err) throw err;
        console.log("Get number of records = "+result.length);

        //==================================  Find transaction switch AMC ( status RED and xwt_reference_no )============
        // let switchCase =await findSwitchCase(result);
        let switchCase =await checkSwitchAMC(result);
        if(switchCase.length > 0 ){
          data.trans = switchCase;
          // data.trans = result
        }else{
          data.trans = result;
        }        
        res.status(200).json(data);
      });
    //res.status(200).send(sql);
  }else{
    res.status(200).send("Data not Found!!");
  }
});

router.post('/selectAllotment', urlencodedParser,async function (req, res) { 
  console.log("==== selectAllotment====");
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let employee = req.body.employee;

  if(employee !== undefined){
    let emp = employee.split(" ");
    let ic_code = emp[0];
    let query = new TranQuery();
    // console.log("+++++++ startDate:"+startDate );
    let sql =query.getTranByAllotmentDate(ic_code,startDate,endDate);

    const _date = new Date(startDate);
    const month = _date.getMonth()+1;
    const year = _date.getFullYear();
    
    // let user =await getEmployeeByID(ic_code);
    // let trailing_fee =await getTrailingFee(ic_code,month,year);
    // let incentive = await getInsentive(ic_code,year+'-'+month+'-01');
    const [user, trailing_fee, incentive, salary] = await Promise.all([
      getEmployeeByID(ic_code),
      getTrailingFee(ic_code, month, year),
      getInsentive(ic_code, `${year}-${month}-01`),
      getSalaryRM(ic_code, `${year}-${month}-01`)
    ]);
    console.log("8xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(trailing_fee);
    console.log("8xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    let data = {'user':user[0],'trans':[]};
    if(trailing_fee.trailing_fee != undefined){
      data.user.trailing_fee = trailing_fee.trailing_fee;
      data.user.trailing = {trailing_fee: trailing_fee.trailing_fee, date:trailing_fee.updated,updater:trailing_fee.updater};
    }
    data.user.salary = salary;
    if(incentive != null){
      data.user.incentive = incentive;
    }
      
    // console.log("----------------------------------------------------");
    console.log(data);
    connection.query(sql,async function (err, result) {
      if (err) throw err;
        // console.log("Get number of records = "+result.length);        
        data.trans = result;
        res.status(200).json(data);
      });
  }else{
    res.status(200).send("Data not Found!!");
  }
});
async function getEmployeeByID(ic_code){
  const SQL = `SELECT 
          name_eng 
          ,lastname_eng 
          ,name_th
          ,lastname_th
          ,department
          ,position
          ,licence_id
          ,licence_type
          ,email
          ,status
          ,target
          ,ic_code 
          ,trailing_fee
          ,start_date
      FROM employees  WHERE ic_code = '`+ic_code+`'`;
  let data;
  try{
      data =await dbConnection.query(SQL);
      // console.log(data[0]);
      return data[0];
  }catch(e){
      console.log(e);
  }
}
async function getTrailingFee(ic_code,month,year){
  const month_active = year+'-'+month+'-01';
  const SQL = `SELECT employee_id, rmTrailingFee, wccTrailingFee, updated, updater 
      FROM trailingFee 
      WHERE employee_id = '${ic_code}'  
      AND month_active BETWEEN '${month_active}' AND LAST_DAY('${month_active}') ORDER BY id DESC`;
  let datas;
  console.log(SQL);
  try{
    datas =await dbConnection.query(SQL);
    let data = datas[0];
    data.sort((a, b) => b.updated - a.updated);
    let latestRecord = data[0];
    // console.log(latestRecord);
    if(latestRecord == undefined){
      latestRecord = 'N/A';
    }
    return latestRecord;
  }catch(e){
    console.log(e);
  }
}

async function getTrailingFeeTeam(team_id,team,month_active){
  txtLog("transaction.js","getTrailingFeeTeam("+team_id+","+team+",month_active)");

  const t = team.map(String).join("','");
  let member = "'"+team_id+"','" + t+"'";

  const SQL = `SELECT id, employee_id, rmTrailingFee, wccTrailingFee
      , updated, month_active 
    FROM trailingFee WHERE month_active='${month_active}' 
    AND employee_id IN (${member}) 
    ORDER BY id DESC;`;
  let datas;
  console.log(SQL);
  try{
    [datas] =await dbConnection.query(SQL);
    // console.log(datas);
    return datas;
  }catch(e){
    console.log(e);
  }
}
//=============================== Monthly Report ==============================
router.get('/monthly/:year/:month', (req, res, next) => {
  const json = {'datas':[],'amc':[]};
  const datas = {'users':[],'amc':[]};
  const m = parseInt(req.params.month)-1;
  const y = parseInt(req.params.year);

  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, firstDay.getMonth() + 1,0);
    
  const firstDayF = firstDay.getFullYear()+"-"+(firstDay.getMonth()+1)+"-"+firstDay.getDate();
  const lastDayF = lastDay.getFullYear()+"-"+(lastDay.getMonth()+1)+"-"+lastDay.getDate();

  const query = new TranQuery();
  const SQL = query.getTransactionByDate(firstDayF,lastDayF);
  // console.log(SQL);
  debugLog(SQL);
  /** Get Transaction per month */

  connection.query(SQL,async function (err, result) {  
    if (err) throw err;
    let d = y+"-"+(m+1)+"-01";
    // Got Transaction Data All Month
    json.datas =await checkSwitchAMC(result);
    
    const sqlRM  = `SELECT employee_id , name_th ,lastname_th ,lastname_eng ,lastname_eng ,position ,ic_code ,email ,status,target as d_target,start_date  FROM employees e WHERE status  = 'A' and department = 'Wealth Management' ORDER BY ic_code ASC`;
    
    connection.query(sqlRM,async function (err, result) {
      console.log(sqlRM);
      if (err) throw err;
      const users = result;
      console.log("---------------------------------------------------------------------------------");
      // console.log(result);    
      for(let i=0; i < users.length;i++){
        const user = users[i];        
        const transactions = [];
        for(let j=0; j< json.datas.length; j++){
          const tran = json.datas[j];
          if(user.ic_code == tran.ic){
            transactions.push(tran);
          }
        }
        user.transactions = transactions;

        //====================================Get Trailing Fee==============================//
        const sqlTrailFee = `SELECT id,employee_id, updated, rmTrailingFee,wccTrailingFee,month_active FROM trailingFee WHERE employee_id = '${user.ic_code}' AND (month_active BETWEEN '${d}' AND LAST_DAY('${d}')) ORDER BY id DESC`;
        
        try{
          const datas = await dbConnection.query(sqlTrailFee);
          user.trailingFee = datas[0];
          
        }catch(e){
          console.log(e);
        }

        //====================================Get Target==============================//
        const sqlPerfromance = "SELECT * FROM user_target up where month_active <= '"+d+"' and ic_code = '"+user.ic_code+"' ORDER BY id DESC;";
        // console.log(sqlPerfromance);
        try{
          const datas = await dbConnection.query(sqlPerfromance);
          user.target = datas[0];
          
        }catch(e){
          console.log(e);
        }
      }

      //====================================Get AMC Sharing==============================//
      const sqlAMC_Sharing = `select * from fund_sharing amc 
      WHERE amc.activated =1 AND amc.promotion_start_date <= '${d}' 
      AND (amc.promotion_end_date IS NULL OR amc.promotion_end_date >= LAST_DAY('${d}'))`;
      let AMC = [];
      try{
        console.log(">>>>>>Query AMC <<<<<<<<<<<");
        console.log(sqlAMC_Sharing);
        const datas = await dbConnection.query(sqlAMC_Sharing);
        AMC = datas[0];
      }catch(e){
        console.log(e);
      }
      //====================================Get Insentive ==============================//

      const sqlInsentive = "SELECT * FROM rm_incentive WHERE activate <='"+d+"' ORDER BY updated DESC";
      let incentive = [];
      try{
        // console.log(">>>>>>Query Insentive <<<<<<<<<<<");
        // console.log(sqlInsentive);
        const datas = await dbConnection.query(sqlInsentive);
        incentive = datas[0];
      }catch(e){
        console.log(e);
      }
      datas.users = users;
      datas.amc = AMC;
      datas.incentives = incentive;

      res.status(200).json(datas);
    });
  });
});

async function findSwitchCase(trans){
  txtLog("transaction.js","--->findSwitchCase()");
  let result = [];
  let switchAMC = trans.filter((trans) => (trans.transaction_type === 'RED' && trans.xwt_reference_no != undefined));

  // console.log(switchAMC);

  if(switchAMC.length>0){
      let count = switchAMC.length
      for(let i=0;i < count;i++){
          let xwt_reference_no = switchAMC[i].xwt_reference_no;
          let sw = trans.filter((trans) => (trans.transaction_type === 'SUB' && trans.xwt_reference_no == xwt_reference_no) );
          if(sw.length==0 ){
              // Query transaction by xwt_reference_no
              let SQL = new TranQuery().fieldSelect + " WHERE xwt_reference_no='"+xwt_reference_no+"' AND transaction_type ='SUB' ";
              // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
              // console.log(SQL);
              const datas = await dbConnection.query(SQL);
              // console.log(datas[0]);
              result = result.concat(datas[0]);
          }
      }
  }else{
    result = [];
  }
  // return checkSwitchAMC(result); 
  return result; 
}

async function checkSwitchAMC(trans){
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> checkSwitchAMC >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  let result=[];
  if(trans.length>0){
    for(let i =0 ;i < trans.length ; i++){
      let tran = trans[i];
      if(tran.xwt_reference_no !== null){
        let xwt_reference_no = tran.xwt_reference_no;
        if(tran.transaction_type === 'SUB'){                   
          let sw = trans.filter((trans) => (trans.xwt_reference_no == xwt_reference_no) );
          // console.log("0000000000000000000000000000000 SUB : "+xwt_reference_no+ "  position:"+i);
          if(sw.length === 1){
            // Remove transation RED ในกรณีที่เจอเคสขาย และฝั่งซื้ออยู่คนละเดือน(*ไม่ครบคู่)
            let out= trans.splice(i,1);         
            // console.log("remove ["+i+"]");
            // console.log(out);
            i = -1;
          }
        }else if(tran.transaction_type === 'RED'){
          let sw = trans.filter((trans) => (trans.xwt_reference_no == xwt_reference_no) );
          if(sw.length === 1){
            
            // Add transation SUB ในกรณีที่เจอเคสขาย และฝั่งซื้ออยู่คนละเดือน(*ไม่ครบคู่)
            let SQL = new TranQuery().fieldSelect + " WHERE xwt_reference_no='"+xwt_reference_no+"' AND transaction_type ='SUB' ";
            const datas = await dbConnection.query(SQL);
            // console.log("0000000000000000000000000000000 RED :"+xwt_reference_no+"   count:"+datas[0].length);
            if(datas[0].length > 0){
              result =  result.concat(datas[0]);
              // console.log("Add");
              // console.log(datas[0]);
            }            
          }
        }
      }
    }
    console.log(" checkSwitchAMC  "+result.length);
    if(result.length > 0){
      result = trans.concat(result);
    }else{
      result = trans;
    }
  }else{
    result = trans;
  }  
  
  return result;
}

async function getInsentive(ic_code,date){
  txtLog("transaction.js","--->getIntensive()");
  let SQL = "SELECT * FROM rm_incentive WHERE ic_code ='"+ic_code+"' AND activate <='"+date+"' ORDER BY updated DESC";
  console.log(SQL);
  const datas = await dbConnection.query(SQL);
  if(datas[0].length > 0){
    return datas[0];
  }else{
    return null;
  }
}
async function getInsentiveTeam(team,date){
  txtLog("transaction.js","--->getInsentiveTeam(team,date)");
  let SQL = `SELECT id, ic_code, incentive, updated,status,activate 
    FROM rm_incentive WHERE ic_code IN (${team}) AND activate <='${date}' 
    ORDER BY updated DESC`;
  debugLog(SQL);
  const datas = await dbConnection.query(SQL);
  if(datas[0].length > 0){
    return datas[0];
  }else{
    return null;
  }
}

async function getSalaryRM(ic_code,date){
  txtLog("transaction.js",'>function :getSalaryRM |');
  let SQL = "SELECT * FROM rmSalary WHERE status='1' AND employee_id ='"+ic_code+"' AND active <='"+date+"' ORDER BY active DESC";
  try{
      console.log(SQL);
      const [rows] = await dbConnection.query(SQL);
      // console.log(rows);
      return rows;
  }catch(err){
      console.log(err);
      return {err:"Can not Query Data!"}
  }
}
async function getSalaryTeam(team_id,team,date){
  txtLog("transaction.js",'>function :getSalaryTeam('+team_id+','+team+',date) |');

  const t = team.map(String).join("','");
  let member = "'"+team_id+"','" + t+"'";

  let SQL = `SELECT rs.salary_id, rs.employee_id, rs.base_salary, 
    rs.active, rs.updated_at, rs.status 
    FROM rmSalary rs WHERE status='1' 
	    AND employee_id IN (${member}) AND active <='${date}' 
	    ORDER BY salary_id DESC`
  try{
      debugLog(SQL);
      const [rows] = await dbConnection.query(SQL);
      // console.log(rows);
      return rows;
  }catch(err){
      console.log(err);
      return {err:"Can not Query Data!"}
  }
}
async function getAUM_Team(team,date){
  txtLog("transaction.js",'>function :getAUM_Team('+team+','+date+') |');
  const t = team.map(String).join("','");
  let member = "'" +t+"'";
  let SQL = `SELECT * FROM wcc_TotalOutstandingBalance 
    WHERE IC IN (${member}) AND createDate <= '${date}' Order by id DESC LIMIT 5;`;
  try{
      debugLog(SQL);
      const [rows] = await dbConnFCC.query(SQL);
      // console.log(rows);
      return rows;
  }catch(err){
      console.log(err);
      return {err:"Can not Query Data!"}
  }
}


/**
 * 
 */
router.get('/test',async (req, res, next) => {
  console.log(">>>> test/");
  if(!req.session.isLoggedIn){
    console.log("session expired!!");
    res.redirect('/');
  }else{
    let user = req.session.user;
    res.status(200).render('./tranFormTest', { 
          "data": user,
          "name":user.name_eng+" "+user.lastname_eng,
          "permission":user.permission,
          "ipAPI":HOSTIP
         });
    // console.log(user);
  }
});
router.get('/test2',async (req, res, next) => {
  console.log(">>>> test/");
  if(!req.session.isLoggedIn){
    console.log("session expired!!");
    res.redirect('/');
  }else{
    let user = req.session.user;
    res.status(200).render('./test2', { 
          "data": user,
          "name":user.name_eng+" "+user.lastname_eng,
          "permission":user.permission,
          "ipAPI":HOSTIP
         });
    // console.log(user);
  }
});

async function getTeamByID(teamName){
  txtLog("transaction.js","/getTeamByID("+teamName+")");
  const SQL = `SELECT team_id,name,leader,member,remark,createDate
      FROM wcc_team  WHERE name = '`+teamName+`'`;
  let data;
  try{
      debugLog(SQL);
      data =await dbConnection.query(SQL);
      // console.log(data[0]);
      return data[0];
  }catch(e){
      console.log(e);
  }
}
async function getTransactionByTeam(team,st_date,ed_date){
  txtLog("transaction.js","/getTransactionByTeam("+team+")");
  const query = new TranQuery();
  const SQL =query.getTransactionsByTeam(team,st_date,ed_date);
  // let data;
  try{
      debugLog(SQL);
      const result =await dbConnection.query(SQL);
      const switchCase =await checkSwitchAMC(result[0]);
      // console.log(switchCase);
      if(switchCase.length > 0 ){
        return switchCase;
      }else{
        return result[0];
      }
  }catch(e){
      console.log(e);
  }
}

async function getTargetByTeam(teamName,team,date){
  txtLog("transaction.js","/getTargetByTeam("+team+","+date+")");
  const t = team.map(String).join("','");
  let member = "'"+teamName+"','" + t+"'";
  
  const SQL =`SELECT 
    id, ic_code, target, create_date, last_update, activated, month_active, month 
    FROM user_target WHERE ic_code IN (${member}) AND month_active <= '${date}'
    ORDER BY id DESC  `;
  let data;
  try{
      debugLog(SQL);
      data =await dbConnection.query(SQL);
      // console.log(data[0]);
      return data[0];
  }catch(e){
      console.log(e);
  }
}

async function getTargets(teamName,team,date){
  txtLog("transaction.js","/getTargetByTeam("+team+","+date+")");
  const t = team.map(String).join("','");
  let member = "'"+teamName+"','" + t+"'";
  
  const SQL =`SELECT 
    id, ic_code, target, create_date, last_update, activated, month_active, month 
    FROM user_target WHERE ic_code IN (${member}) AND month_active <= '${date}'
    ORDER BY id DESC  `;
  let data;
  try{
      debugLog(SQL);
      data =await dbConnection.query(SQL);
      // console.log(data[0]);
      return data[0];
  }catch(e){
      console.log(e);
  }
}

//============================  API Session =======================

router.post('/team', urlencodedParser,async function (req, res) { 
  txtLog("transaction.js","/team");

  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let teamName = req.body.team;

  try{
    const [team] =await getTeamByID(teamName);
    const fixedStr = team.member.replace(/(\w+):/g, '"$1":'); 
    const json = JSON.parse(fixedStr);
    const member = json.member;
    const [trailing,salary,incentive,transaction,target,AUM] = await Promise.all([
      getTrailingFeeTeam(teamName,member, startDate),
      getSalaryTeam(teamName, member,startDate),
      getInsentiveTeam(member,startDate),
      getTransactionByTeam(member,startDate,endDate),
      getTargetByTeam(teamName,member,startDate),
      getAUM_Team(member,endDate)
    ]);

    const data ={
      'team':team,
      'trailing':trailing,
      'salary':salary,
      'incentive':incentive,
      'trans':transaction,
      'target':target,
      'AUM':AUM
    }
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(200).json({'err':err});
  }
  
});


router.get('/targetTeam/:date/:member', urlencodedParser,async function (req, res) { 
  txtLog("transaction.js","/targetTeam");
    let date = req.params.date;
    let member = req.params.member;

    // getTargetByTeam('TE01')
    // try{
    //   data =await dbConnection.query(SQL);
    //   // console.log(data[0]);
    // }catch(e){
    //   D.debugLog(e);
    // }
    res.status(200).send({'status':'OK'});
});

// ================ Get Salary Target rmTrailing wccTrailing =====================
async function getTargets(st,ed,ic_code){
  txtLog("transaction.js","getTargets(st,ed,ic_code)");
  
  // let SQL =`
  // SELECT DISTINCT id,ic_code ,month_active, target
  //   FROM user_target  
  //   WHERE (month_active BETWEEN '${st}' AND '${ed}')
  //   AND ic_code='${ic_code}' 
  //   Order by month_active DESC`;
  let SQL =`
    SELECT DISTINCT id,ic_code ,month_active, target
      FROM user_target  
      WHERE (month_active <= '${st}' )
      AND ic_code='${ic_code}' 
      Order by month_active DESC`;

  try{
      debugLog(SQL);
      [data] =await dbConnection.query(SQL);
      return data;
  }catch(e){
      console.log(e);
  }
}
async function getSalaries(st,ed,ic_code){
  txtLog("transaction.js","getSalary(st,ed,ic_code)");
  
  let SQL =`SELECT employee_id,base_salary,active,status from rmSalary 
	WHERE (active BETWEEN '${st}' AND  '${ed}')
    	AND employee_id ='${ic_code}'AND status =1
    	Order by active DESC`;

  try{
      debugLog(SQL);
      [data] =await dbConnection.query(SQL);
      return data;
  }catch(e){
      console.log(e);
  }
}
async function getTrailingMonth(st,ed,ic_code){
  txtLog("transaction.js","getSalary(st,ed,ic_code)");
  
  let SQL =`select * from trailingFee 
	WHERE (month_active BETWEEN '${st}' AND '${ed}')
    	AND employee_id ='${ic_code}'
    	Order by id DESC`;

  try{
      debugLog(SQL);
      [data] =await dbConnection.query(SQL);
      return data;
  }catch(e){
      console.log(e);
  }
}


router.post('/targets/', urlencodedParser,async function (req, res) { 
  txtLog("[transaction.js]","/targets");
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let ic_code = req.body.ic_code;

  try{
    const [targets,salaies,trailing] = await Promise.all([
      getTargets(startDate,endDate,ic_code),
      getSalaries(startDate,endDate,ic_code),
      getTrailingMonth(startDate,endDate,ic_code)
    ]);


    res.status(200).json([targets,salaies,trailing]);
  }catch(err){
    console.log(err);
    res.status(200).json({'err':err});
  }

});

module.exports = router;
//2023-07-07