const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { Debug } = require('../classes/Debug');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const {  HOSTIP } = require('../config/dbConfig');

const xl = require('excel4node');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const parentDir = path.dirname(__dirname);                          // ถอยกลับมาหนึ่งระดับจาก __dirname
// router.use(bodyParser.text());

const DEBUG = new Debug(true, "job.js");

router.get('/',function(req,res){
    res.render('./report/index');
});

router.get('/aeh', function(req, res) {
    // res.status(200).send({"ic":"OK"});
    res.render('./report/aeh', { title: 'WCC'});
});

router.get('/xan', function(req, res) {
    res.render('./report/xan/amcDiff', { title: 'WCC'});
});

router.get('/amc/:name', function(req, res) {
    const name = req.params.name;
    if(name === "KTAM"){
        res.render('./report/ktam', { title:name});
    }else if(name === "KSAM"){
        res.render('./report/ksam', { title:name});
    }else if(name === "SCB"){
        res.render('./report/scb', { title:name});
    }else{
        res.status(200).send({title:name});
    }
});

router.get('/dew', function(req, res) {  
    res.render('./report/fcc2kkp', { title: 'WCC',HOME:HOSTIP});
});

router.post('/kkp', function(req, res) { 
    try{
        const text = req.body.text; 
        const fileName = req.body.fileName;
        const PATH = parentDir + '/uploads/kkp/';
        const filePath = PATH+fileName;
        console.log(text);
        console.log(fileName);
        console.log(filePath);
        const buffer = iconv.encode(text, 'win874');
        fs.writeFileSync(filePath, buffer);
        //res.status(200).json({'status':'OK'});

        // ส่งไฟล์กลับไปให้ลูกค้า
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            } else {
                console.log('File downloaded successfully');
            }
        });
    }catch(e){
        console.log(e);
        res.status(200).json({'status':'NOT OK'});
    }
});

module.exports = router