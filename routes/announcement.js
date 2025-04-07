const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); 
const {  Debug } = require('../classes/Debug');

const D = new Debug(1,"anniuncement.js");

router.get('/', function(req, res) {
    D.debugLog("== routes/announcement.js ==");
    // res.status(200).json({'status':'OK'});
    res.render('./announcement/announce', { title: 'ประกาศบริษัท' });
});

module.exports = router;