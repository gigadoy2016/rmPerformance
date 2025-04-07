/**
 */
const express = require('express');
const router = express.Router();
const {  dbConnection,connection,HOSTIP } = require('../config/dbConfig');
const {  txtLog,debugLog } = require('../config/log');

const rootFile = '[employee.js]';
  
//=========================== API =================================

router.post('/select',function(req, res, next) {
    console.log("----- Employee API -----------------------------------------");
    let user_id = req.body.user_id;
    let name_eng = req.body.name_eng;
    let lastname_eng = req.body.lastname_eng;
    let user = {'user_id':user_id,'name_eng':name_eng,'lastname_eng':lastname_eng}
  
    const SQL = `SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.name_eng like '%`+name_eng+`%' AND e.status = 'A'
    UNION 
    SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.lastname_eng like '%`+lastname_eng+`%' AND e.status = 'A'
    UNION 
    SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.ic_code like '%`+user_id+`%' AND e.status = 'A'`;

    // console.log(SQL);
    res.send(user);
});
router.post('/search',function(req, res, next) {
    console.log("----- Employee API -----------------------------------------");
    let txt = req.body.word;
    // console.log(req.body);
  
    const SQL = `SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.name_eng like '%`+txt+`%' AND e.status = 'A'
    UNION 
    SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.lastname_eng like '%`+txt+`%' AND e.status = 'A'
    UNION 
    SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.ic_code like '%`+txt+`%' AND e.status = 'A'`;

    // console.log(SQL);

    connection.query(SQL, function (err, result) {
        if (err) {
          res.status(500).send(err); 
        }else{
          res.status(200).send(result);
        }
    });
});

router.post('/find',function(req, res, next) {
    console.log("-----find Employee API -----------------------------------------");
    let txt = req.body.word;
    let ic_code = req.body.ic;
    let boss = ic_code % 1000;
    let option = "";
    let subGroup = '';


    if(boss === 0){
        let div = ic_code/1000;
        option =" AND e.ic_code LIKE '"+div+"%' ";
    }else{
        subGroup = ic_code.substring(0, ic_code.length - 2);
        option =" AND e.ic_code LIKE '"+subGroup+"%' ";
    }

    const SQL = `SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.name_eng LIKE '%`+txt+`%' AND e.status = 'A' `+option+`
    UNION 
    SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.lastname_eng LIKE '%`+txt+`%' AND e.status = 'A' `+option+`
    UNION 
    SELECT e.name_eng ,e.lastname_eng ,e.ic_code FROM employees e 
    WHERE e.ic_code LIKE '%`+txt+`%' AND e.status = 'A' `+option ;

    // console.log(SQL);

    connection.query(SQL, function (err, result) {
        if (err) {
          res.status(500).send(err); 
        }else{
          res.status(200).send(result);
        }
    });
});

router.post('/findID',async function(req, res, next) {
    console.log("-----Search Employee by ID API ----------------------------");
    let id = req.body.id;
    let data =await getEmployeeByID(id);
    res.status(200).json(data);
});


router.post('/all',function(req, res, next) {
    getRM_All().then((value)=>{
        res.status(200).json(value);
    });
});

router.get('/show',function(req, res, next) {
    res.render('employeesList',{'title':'Admin','ipAPI':HOSTIP});
});

router.get('/:id',async function(req, res, next) {
    let id =  req.params.id;
    let data =await getEmployeeByID(id);
    user = data[0];
    let trailingFee = await getTrailingFeeByID(id);
    let target = await getTargetByID(id);
    
    if(trailingFee[0] != undefined)
        user.trailingFee = JSON.stringify(trailingFee);
    if(target[0] != undefined ){
        user.target = JSON.stringify(target);
    }

    console.log(user);
    res.render('employee/profile',{
            'title':'Profile: '+ user.name_eng
            ,'ipAPI':HOSTIP
            ,'employee_id':user.employee_id
            ,'name_eng':user.name_eng
            ,'lastname_eng':user.lastname_eng
            ,'name_th':user.name_th
            ,'lastname_th':user.lastname_th
            ,'department':user.department
            ,'position':user.position
            ,'licence_id':user.licence_id
            ,'licence_type':user.licence_type
            ,'licence_exp':user.licence_exp
            ,'email':user.email
            ,'status':user.status
            ,'ic_code':user.ic_code
            ,'trailingFee':user.trailingFee
            ,'target':user.target
        }
    );
});


//============================================================================= Function session ===
async function getEmployeeByID(ic_code){
    const SQL = `SELECT 
            employee_id
            ,name_eng 
            ,lastname_eng 
            ,name_th
            ,lastname_th
            ,department
            ,position
            ,licence_id
            ,licence_type
            ,DATE_FORMAT(licence_exp, '%d/%m/%Y') licence_exp
            ,email
            ,status
            ,target
            ,ic_code
            ,trailing_fee  
        FROM employees  WHERE ic_code = '`+ic_code+`'`;
    let data;
    console.log(SQL);
    try{
        data =await dbConnection.query(SQL);
        // console.log(data[0]);
        return data[0];
    }catch(e){
        console.log(e);
    }
}

async function getEmployeeAll(){
    const SQL = `SELECT 
            employee_id
            ,name_eng 
            ,lastname_eng 
            ,name_th
            ,lastname_th
            ,department
            ,position
            ,licence_id
            ,licence_type
            ,licence_exp
            ,email
            ,status
            ,target
            ,ic_code 
            ,trailing_fee  
        FROM employees;`;
    let data;
    try{
        data =await dbConnection.query(SQL);
        return data[0];
    }catch(e){
        console.log(e);
    }
}
async function getRM_All(){
    txtLog("employee.js","Debug getRM_All()");
    const SQL = `SELECT 
            employee_id
            ,name_eng 
            ,lastname_eng 
            ,name_th
            ,lastname_th
            ,department
            ,position
            ,licence_id
            ,licence_type
            ,licence_exp
            ,email
            ,status
            ,target
            ,ic_code 
            ,trailing_fee  
        FROM employees WHERE ic_code IS NOT NULL;`;
    let data;
    try{
        // debugLog(SQL);
        data =await dbConnection.query(SQL);
        return data[0];
    }catch(e){
        console.log(e);
    }
}

async function getTrailingFeeByID(id){
    const SQL = `SELECT employee_id, month, rmTrailingFee, wccTrailingFee, updater
            ,DATE_FORMAT(updated, '%d/%m/%Y %H:%i:%s') updated 
        FROM trailingFee WHERE employee_id ='`+id+`'`;
    let data;
    try{
        // debugLog(SQL);
        data =await dbConnection.query(SQL);
        return data[0];
    }catch(e){
        console.log(e);
    }
}
async function getTargetByID(id){
    const SQL = `SELECT ic_code,month, target, DATE_FORMAT(month_active, '%d/%m/%Y') month_active  
        FROM user_performance WHERE ic_code ='`+id+`'`;
    let data;
    try{
        debugLog(SQL);
        data =await dbConnection.query(SQL);
        return data[0];
    }catch(e){
        console.log(e);
    }
}


module.exports = router

// let data =getEmployeeAll().then((value)=>{
//     console.log(value);
// });

// console.log("++++");
// console.log(data);