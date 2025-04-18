const express = require('express');
const router = express.Router();
const {  dbConnJob,HOSTIP } = require('../config/dbConfig');
const { Debug } = require('../classes/Debug');

const DEBUG = new Debug(true, "/route/target.js");

router.get('/', (req, res) => {
    res.render('./target/view', { title: 'RM Target update',"ipAPI":HOSTIP });
});

router.post('/upload', async (req, res) => {
    const { target,createDate } = req.body;
    DEBUG.Log("--> upload target-->");
    const values = [];
    
    for(const row of target) {
        // console.log(row);
        const ic_code = row["IC"] || row[1] || null;
        const target_value = parseInt(row["Target"] || row[2]) || 0;
        const month_active = row["Active"] || null;
        const activated = 1;
        const create_date = createDate || new Date().toISOString().slice(0, 10);

        values.push([ic_code, target_value, create_date, create_date, activated, month_active]);

        if (values.length === 0) {
            return res.status(200).send("No valid data to insert after validation.");
        }

        DEBUG.Log(`IC Code: ${ic_code}, Target: ${target_value}, Month Active: ${month_active}, Activated: ${activated}`);
    }

    let SQL = "INSERT INTO gb_main.user_target (ic_code, target, create_date, last_update, activated, month_active) VALUES ?";
    try{
        const [result] = await dbConnJob.query(SQL, [values]);
        console.log("Insert Result: ", result);
        res.status(200).json({ 
            status: "OK" ,
            message: "Data inserted successfully",
        });
    } catch (error) {
        console.log(error);
        DEBUG.debugLog("Error: ", error.message);
        res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
});



module.exports = router