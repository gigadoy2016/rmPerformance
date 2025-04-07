const express = require('express');
const session = require('express-session');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { connection,HOSTIP } = require('../config/dbConfig');
const { txtLog } = require('../config/log');
const bcrypt = require('bcrypt');
const router = express.Router();
 
// ตั้งค่า session
router.use(session({
    secret: 'mysecretkey',
    resave: true,
    saveUninitialized: true
}));

// ตั้งค่า bodyParser และ cookieParser
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

const ifNotLoggedIn =(req,res,next)=>{
    if(!req.session.isLoggedIn){
      return res.render('login');
    }
    next();
}
const ifLoggedIn = (req,res,next) =>{
    if(req.session.isLoggedIn){
        return res.redirect('/transactions/list');
    }
    next();
}

// เมื่้อเข้ามาที่หน้าแรก path: "/". 
router.get('/', function(req, res, next) {
    // res.render('login', { title: '',name:'' });
    res.render('login', { title: '',"ipAPI":HOSTIP });
});

router.post('/resetPassword',async  function(req, res, next) {
    res.render('login', { title: 'WCC' });
});


//=================================== Login Page ==============================================


router.post('/signin',async  function(req, res, next) {
    txtLog("index.js","signin");
    try{
        let username = req.body.uname;
        let password = req.body.psw;
        const saltRounds = bcrypt.genSaltSync(10);

        const SQL =`SELECT u.id 
        , u.username 
        , u.password 
        , u.email 
        , e.name_th 
        , e.lastname_th 
        , e.name_eng 
        , e.lastname_eng 
        , e.ic_code
        , e.target 
        , e.trailing_fee 
        , ac.resource_id 
        , ac.permission 
        FROM users u 
        LEFT JOIN employees e ON u.email = e.email 
        LEFT JOIN access_control ac ON ac.user_id = u.id 
    WHERE ac.resource_id =1 AND u.username = '`+username+`';`;
        console.log(SQL);
        connection.query(SQL,async (error, results, fields) => {
            if (error) throw error;
            // console.log("1-------------------------");
            console.log(results);
            if (results.length > 0) {
                const user = results[0]; 
                // console.log(user);
                // console.log("2-------------------------");
                const isPasswordMatch =await bcrypt.compareSync(password, user.password);
                // console.log(isPasswordMatch);
                if (isPasswordMatch) {
                    // handle login success
                    req.session.isLoggedIn = true;
                    req.session.user = {
                        'id':user.id,
                        'username':user.username,
                        'name_eng':user.name_eng,
                        'lastname_eng':user.lastname_eng,
                        'email':user.email,
                        'ic_code':user.ic_code,
                        'target':user.target,
                        'trailing_fee':user.trailing_fee,
                        'resource_id':user.resource_id,
                        'permission':user.permission
                    };
                    // res.send(user);
                    res.redirect('/transactions/list');
                } else {
                    // กลับไปหน้า login
                    // res.send('Login failed'); 
                    res.render('login', { 
                        title:"Login Failed!!","ipAPI":HOSTIP
                    });
                }
            } else {
            //   res.send('Login failed');
              res.render('login', { 
                title:"Login Failed!!","ipAPI":HOSTIP
            });
            }
        });

        //res.status(200).send("{'user','"+username+"','password':'"+password+"'}");
        // res.status(200).send("{'user','test','password':'test'}");
    }catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

module.exports = router