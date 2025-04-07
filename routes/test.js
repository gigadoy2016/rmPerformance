const express = require('express');
const xl = require('excel4node');
const router = express.Router();
const {  txtLog } = require('../config/log');
const {  connection,dbConnection,HOSTIP,dbConnFCC } = require('../config/dbConfig');

router.get('/', function(req, res, next) {
    let user = {name_eng:'eng', lastname_eng:'l',target :1000,ic_code:'4400',}
    res.render('testexcel'
        , { title: 'WCC',name:'Excel',ipAPI:'test', data:user,permission:3}
    );
});

router.get('/2', function(req, res, next) {
    let user = {name_eng:'eng', lastname_eng:'l',target :1000,ic_code:'4400',}
    //res.send({"status":user});

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1'); 
    ws.cell(1,1).number(100); 
    ws.cell(1,2).string('some text'); 
    ws.cell(1,3).formula('A1+A2'); 
    ws.cell(1,4).bool(true);
    wb.write('ExcelFile.xlsx', res);
});

router.post('/xls', function(req, res, next) {
    txtLog("test.js","============= test POST ==============");
    const data=  req.body.d;
    let json = JSON.parse(data);
    res.json(json);
});

module.exports = router

function testData(){

}
console.log("123456");