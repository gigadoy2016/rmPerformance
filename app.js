var express = require('express');
var app = express();
const path = require('path') // เรียกใช้งาน path module
const PORT = 3000;
const system_id = 1;

// ส่วนของการใช้งาน router module ต่างๆ 
const indexRouter = require('./routes/index');
const transactionRouter = require('./routes/transaction');
const amcRouter = require('./routes/amc'); // model ของบลจ
const userRouter = require('./routes/user');
const employeeRouter = require('./routes/employee');
const trailingRouter = require('./routes/trailingFee');
const xlsRouter = require('./routes/xls');
const testRouter = require('./routes/test');
const jobRouter = require('./routes/job');
const reportRouter = require('./routes/report');
const announceRouter = require('./routes/announcement');
const aumRouter = require('./routes/aum');

const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

// app.use(express.urlencoded({extended:false}));

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view options', {delimiter: '%'});

app.use(cookieSession({
  name:'session',
  keys:['key1','key2'],
  maxAge:3600*2000 // 1hr
}));
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// use res.render to load up an ejs view file

// index page Login first
app.use('/', indexRouter);

app.use('/transaction', transactionRouter);
app.use('/transactions', transactionRouter);
app.use('/amc', amcRouter);
app.use('/user', userRouter);
app.use('/users', userRouter);
app.use('/employee', employeeRouter);
app.use('/employees', employeeRouter);
app.use('/trailingFee',trailingRouter);
app.use('/xls',xlsRouter);
app.use('/job',jobRouter)
app.use('/test', testRouter);
app.use('/report', reportRouter);
app.use('/announcement',announceRouter);
app.use('/aum',aumRouter)

const server = app.listen(PORT,function(){
  const HOST = server.address().address;
  const port = server.address().port;
  console.log("Listening at http://%s:%s",HOST,port);
  console.log("========================start service==========================================");
});  
