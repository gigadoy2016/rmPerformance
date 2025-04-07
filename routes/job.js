const express = require('express');
const router = express.Router();
const {  connection,HOSTIP } = require('../config/dbConfig');
const {  Employee } = require('../classes/Employee');
const {  Job } = require('../classes/Jobs');
const bodyParser = require('body-parser');
const { Debug } = require('../classes/Debug');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const DEBUG = new Debug(true, "job.js");

// Method Get: 
router.get('/create', function(req, res, next) {
    res.render('./job/create', { title: 'WCC',"ipAPI":HOSTIP });
});

router.get('/read/:txt', function(req, res, next) {
    DEBUG.Log("---- router:read");
    const encode = req.params.txt;
    const decode = atob(encode);
    const param = decode.split("|");
    const ic_code = param[0];
    const date = param[1];
    console.log(param);
    const job = new Job().selectByID(ic_code,date).then(function(result){
        let data = result[0];
        // console.log(data);
        let show1;
        let button1;
        let button2 ={caption:'Reject', style:'btn-danger',type:'submit', 'enable':'',button2:'REJECTED'};

        if(data.status === "CREATE"){
            show1 = {caption:data.status, style:'btn-warning', 'enable':'enable'};
            button1 = {caption:'Approving', style:'btn-secondary', 'enable':'disabled'};
            button2 = {caption:'Reject', style:'btn-secondary', 'enable':'disabled'};
            res.render('./job/view', { title: 'WCC',"ipAPI":HOSTIP,"data": data,"button1":button1,"button2":button2, "show1":show1 });
        }else if(data.status === "APPROVED"){
            show1 = {caption:data.status, style:'btn-info', 'enable':'enable'};
            button1 = {caption:'ทำงานสำเร็จแล้ว', style:'btn-success',type:'submit', 'enable':'enable'};
            res.render('./job/view', { title: 'WCC',"ipAPI":HOSTIP,"data": data,"button1":button1,"button2":button2, "show1":show1 });
        }else if(data.status === "SUCCESS"){            
            show1 = {caption:data.status, style:'btn-success', 'enable':'enable'};
            let javascript = " onClick=\"  window.close(); \"";
            button1 = {caption:'END', style:'btn-success',type:'hidden ', 'enable':'enable' + javascript};
            button2 = {caption:'----', style:'btn-secondary', 'enable':'hidden '};
            res.render('./job/view', { title: 'WCC',"ipAPI":HOSTIP,"data": data,"button1":button1,"button2":button2, "show1":show1 });
        }else if(data.status === "REJECTED"){

            console.log("+++++++++++++++++++++++++++REJECTED++");
            console.log(data);
            show1 = {caption:data.status, style:'btn-warning', 'enable':'enable'};
            button1 = {caption:'แก้ไขงาน', style:'btn-secondary', 'enable':''};
            button2 = {caption:'Reject', style:'btn-secondary', 'enable':'disabled'};
            
            res.render('./job/create', { title: 'WCC'
                ,"data": JSON.stringify(data)
                ,"button1":button1
                ,"button2":button2
                , "show1":show1 
                ,'ic_code':data.ic,
                'name_eng':data.name_eng,
                'lastname_eng':data.lastname_eng,
                'name_th':data.name_th,
                'lastname_th':data.lastname_th,
                'email':data.email,
                'approver_id':data.approval_id,
                'customer_type':data.customer_type,
                'job_id':data.job_id,
                'ipAPI':HOSTIP,
                'header':'Edit Job'
            });
        }
        
    });
});

router.get('/approve/:param', function(req, res, next) {
    const encode = req.params.param;
    const decode = atob(encode);
    const param = decode.split("|");
    const ic_code = param[0];
    const date = param[1];

    console.log("------------------------------------------------");
    console.log(date);
    const job = new Job().select(ic_code,date).then(function(result){
        let data = result[0];
        console.log(data);
        data.text = data.text.replaceAll('\r\n',' ');
        let show1;
        let button1;
        let button2 = {caption:'Reject', style:'btn-danger',type:'submit', 'enable':'',status:'REJECTED'};
        // console.log(data);
        if(data.status === "CREATE"){
            show1 = {caption:data.status, style:'btn-warning',type:'submit', 'enable':'enable'};
            button1 = {caption:'Approving', style:'btn-primary',type:'submit', 'enable':''};
            button2 = {caption:'Reject', style:'btn-danger',type:'submit', 'enable':'',status:'REJECTED'};
        }else if(data.status === "APPROVED"){
            show1 = {caption:data.status, style:'btn-warning',type:'submit', 'enable':'enable'};
            button1 = {caption:'Success', style:'btn-secondary',type:'button', 'enable':'disabled'};
        }else{
            show1 = {caption:data.status, style:'btn-warning', type:'button','enable':'enable'};
            button1 = {caption:'Success', style:'btn-secondary',type:'button', 'enable':'disabled'};
        }

        res.render('./job/view', { title: 'WCC',"ipAPI":HOSTIP,"data": data,"button1":button1,"button2":button2, "show1":show1 });
        
    });
    // res.status(200).send({"ic":ic_code,"date":date});
});

router.get('/list', function(req, res, next) {
    // res.render('./job/create', { title: 'WCC',"ipAPI":HOSTIP });
});
router.get('/delete', function(req, res, next) {
    // res.render('./job/create', { title: 'WCC',"ipAPI":HOSTIP });
});

router.get('/create/:id',async function(req, res, next) {
    const id = req.params.id;
    new Employee().getEmployeeByID(id).then(function(user){
        let approval_id;
        let approver;
        // console.log(user);
        if(user[0].approver == undefined){
            approver = "เจษฎา ยงพิทยาพงศ์";
            approval_id = "0001";
        }else{
            approver = user[0].approver;
            approval_id = approver[0].approver_id;
        }
        
        // console.log(approver);

        res.render('./job/create', { 
            title: 'WCC',
            'ic_code':user[0].ic_code,
            'name_eng':user[0].name_eng,
            'lastname_eng':user[0].lastname_eng,
            'name_th':user[0].name_th,
            'lastname_th':user[0].lastname_th,
            'email':user[0].email,
            'approver_id':approval_id,
            'ipAPI':HOSTIP,
            'customer_type':'',
            'header':'Create Job.',
            'job_id':'',
            'data':''
        });
    });
});

//Method Post:
router.post('/create',async function(req, res, next) {
    let ic_code = req.body.ic_code;
    let customerType = req.body.customerType;
    let customerName = req.body.customer_name;
    let customerId = req.body.customer_id;
    let target = req.body.target;
    let message = req.body.message;
    let email = req.body.email;
    let workDate = req.body.workDate;
    let workDate2 = req.body.workDate2;
    let approval_id = req.body.approval_id;

    let target_m = target.replaceAll(",","");

    const job = new Job().createJob(
        ic_code
        ,customerType
        ,customerName
        ,customerId
        ,target_m
        ,message
        ,email
        ,workDate
        ,workDate2
        ,approval_id
        ).then(function(result){            
            DEBUG.Log(result);
            // res.status(200).send(result);
            res.render('./job/success', { title: 'WCC',"ipAPI":HOSTIP,'status':'สร้างภารกิจเรียบร้อยแล้ว' });
            // ============================================== รอทำหน้า Success แล้วไปหน้า Home
        });
});
router.post('/approved', function(req, res, next) {
    DEBUG.Log("Process Approved---:");
    let job_id = req.body.job_id;
    let approval_id = req.body.approval_id;
    let submit = req.body.submit;
    const job = new Job();
    if(submit ==="CREATE"){
        job.approvedJob(job_id,approval_id).then(function(result){
            // res.status(200).send({"status":result});    
            res.render('./job/success', { title: 'WCC',"ipAPI":HOSTIP,'status':'อนุมัติเรียบร้อยแล้ว' });
        });
    }else if(submit ==="APPROVED"){
        job.successJob(job_id,approval_id).then(function(result){
            // res.status(200).send({"status":result});
            res.render('./job/success', { title: 'WCC',"ipAPI":HOSTIP,'status':'ปิด Job' });
        });
    }else{

    }    
});

router.post('/read', function(req, res) {
    let ic_code = req.body.ic_code;
    let permission = req.body.permission;
    let month = req.body.month;
    let year = req.body.year;
    const job = new Job().loadJobs(ic_code,permission,month,year).then(function(result){
        res.status(200).send(result);
    });
});
router.post('/rejected', function(req, res) {
    DEBUG.Log("Process rejected---:");
    let job_id = req.body.job_id;
    let approval_id = req.body.approval_id;
    let submit = req.body.submit2;
    // DEBUG.Log(job_id+"  "+approval_id+"  "+submit);
    const job = new Job();
    if(submit ==="REJECTED"){
        job.rejectJob(job_id,approval_id).then(function(result){
            res.render('./job/success', { title: 'WCC',"ipAPI":HOSTIP,'status':'ปฏิเสธอนุมัติเรียบร้อยแล้ว' });
        });
    }
    // res.status(200).send(approval_id);
});

router.post('/edit', function(req, res) {
    DEBUG.Log("Process Edit---:");
    let job_id = req.body.job_id;
    let ic_code = req.body.ic_code;
    let customerType = req.body.customerType;
    let customerName = req.body.customer_name;
    let customerId = req.body.customer_id;
    let target = req.body.target;
    let message = req.body.message;
    let create_date = req.body.create_date;
    let workDate = req.body.workDate;
    let workDate2 = req.body.workDate2;
    let approval_id = req.body.approval_id;
    let target_m = target.replaceAll(",","");

    const job = new Job();
    job.editJob(job_id,ic_code,customerType,customerName,customerId,target_m,message,workDate,workDate2,approval_id,create_date).then(
        function(result){
            res.render('./job/success', { title: 'WCC',"ipAPI":HOSTIP,'status':'แก้ไขเรียบร้อยแล้ว' });
        });

});

router.get('/test', function(req, res) {
    res.render('./job/success', { title: 'WCC',"ipAPI":HOSTIP });
});


router.get('/report/:year/:month', function(req, res) {
    DEBUG.Log("GET /report/");
    const year = req.params.year;
    const month = req.params.month;
    console.log(month);

    if(month != undefined){
        const job = new Job().reportJobs(month,year).then(function(result){
            // res.status(200).send(result);
            res.render('./job/report', { title: 'WCC',"ipAPI":HOSTIP,datas:JSON.stringify(result) });
        })
    }else{
        res.render('./job/report', { title: 'WCC',"ipAPI":HOSTIP });
    }
    
});
router.get('/report/', function(req, res) {
    DEBUG.Log("GET /report/");
    if(!req.session.isLoggedIn){
        console.log("session expired!!");
        res.redirect('/');
    }else{
        let user = req.session.user;
        res.status(200).render('./job/report'
          , {
            title: 'WCC',
            "data": user,
            "name":user.name_eng+" "+user.lastname_eng,
            "permission":user.permission,
            "ipAPI":HOSTIP,
            datas:""
           });
    }
    // res.render('./job/report', { title: 'WCC',"ipAPI":HOSTIP ,datas:""});
});

router.get('/api/:month', function(req, res) {
    DEBUG.Log("GET /api/");
    const month = req.params.month;

    const job = new Job().reportJobs(month).then(function(result){
        res.status(200).send(result);
    })
    
});

module.exports = router