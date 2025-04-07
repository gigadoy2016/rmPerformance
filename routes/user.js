const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const {  connection,HOSTIP } = require('../config/dbConfig');
const saltRounds = bcrypt.genSaltSync(10);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


// Users router path: "/". 
router.get('/', function(req, res, next) {
    res.render('login', { title: 'WCC',"ipAPI":HOSTIP });
});

router.post('/add', function(req, res, next) {
    console.log(req.body);
    console.log("---------");
    let username = req.body.uname;
    let password = req.body.psw;
    let email = req.body.email;

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const SQL = 'INSERT INTO `users` (`username`, `password`,`email`) VALUES (?, ?, ?)';
    connection.query(SQL, [username, hashedPassword,email], (err, result) => {
        if (err) {
          // handle error
          res.send(err);
        } else {
          // handle success
          res.send({'status':'205','user':username,'pass':password,'hash':hashedPassword});
        }
    });
});



router.post('/pass', function(req, res, next) {
    let username = req.body.uname;
    let password = req.body.psw;

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const SQL = 'INSERT INTO `users` (`username`, `password`) VALUES (?, ?)';

    res.send({'status':'205','user':username,'pass':password});
});

router.post('/email', function(req, res, next) {
  let email = req.body.email;
  console.log("== Query Email ===");
  const SQL = "SELECT count(*) as ans,password FROM `users` WHERE email = '"+email+"' AND status = 1;";
  // console.log(SQL);
  connection.query(SQL, (err, result) => {
    if(err){
      res.send(err);
    }else{
      console.log(result);
      let a = result[0];
      res.json(a);
    }
  });
});

router.post('/reset-password',async function(req, res, next) {
  let email = req.body.email;
  let oldPass = req.body.oldPass;
  let newPass = req.body.newPass;

  console.log("== Reset Email Updated password===");
  console.log(req.body);

  // const hashedPassword = bcrypt.hashSync(oldPass, saltRounds);
  

  const hashedPassword =await bcrypt.hashSync(newPass, saltRounds);
  const updateSQL = "UPDATE users SET password='"+hashedPassword+"' WHERE email='"+email+"' AND password='"+oldPass+"';";
  // console.log(updateSQL);
  connection.query(updateSQL, (err, result) => {
    if(err){
      res.send(err);
    }else{
      console.log(result.affectedRows);
      if(result.affectedRows==0){
        res.send({'status':200,'ans':"Password is not matched",'code':201});
      }else{
        res.send({'status':200,'ans':"Password Changed!!!",'code':200});
      }
      
    }
  });
  // res.send({'status':200});
});

router.get('/monthly', function(req, res, next) {
  res.render('report/performance', { title: 'WCC',"ipAPI":HOSTIP });
});


module.exports = router