const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const {  conn,dbConnFCC,HOSTIP } = require('../config/dbConfig');
const {  Debug } = require('../classes/Debug');
const D = new Debug(true,"aum.js");



// กำหนดที่เก็บไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/aum'); // โฟลเดอร์เก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // ชื่อไฟล์ไม่ซ้ำ
    }
});
const upload = multer({ storage: storage });

router.get('/',async function (req, res) {
    D.debugLog(">>>> AUM.js root >>>>>");
    res.render('aum/uploadAum', { title: 'WCC',ipAPI: HOSTIP});
});

router.post('/uploadAUM', async function (req, res) {
    D.debugLog("POST /uploadAUM");
    try {
        const jsonData = req.body.aum; // รับข้อมูล JSON
        const createDate = req.body.createDate;

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid JSON data" });
        }
        // console.log(jsonData.createDate);

        D.debugLog("Received JSON Data: ", JSON.stringify(jsonData));
        const values = [];
        const currentDate = new Date().toISOString().slice(0, 10);

        for (const row of jsonData) {
            const account_id = row["Account ID"] || row[1] || null;
            const amc = row["AMC"] || row["7"] || null;
            const unitholder_id = row["Unitholder ID"] || row["2"] || null; // เพิ่ม unitholder_id
            const unitholder_type = row["Unitholder Type"] || row["3"] || null; // เพิ่ม unitholder_type
            const ic = row["IC"] || row["10"] || null;
            const team = row["Team"] || row["4"] || null; // เพิ่ม team
            const branch = row["Branch"] || row["5"] || null; // เพิ่ม branch
            const fund_code = row["Fund Code"] || row["8"] || null;
            const available_balance_unit = parseFloat(row["Available Balance Unit"] || row["9"]) || null;
            const available_balance_amount = parseFloat(row["Available Balance Amount"] || row["12"]) || null;
            const outstanding_balance_unit = parseFloat(row["Outstanding Balance Unit"] || row["11"]) || null;
            const outstanding_balance_amount = parseFloat(row["Outstanding Balance Amount"]|| row["13"]) || null;
            const pending_allot_unit = parseFloat(row["Pending Allot Unit"] || row["14"]) || null;
            const pending_allot_amount = parseFloat(row["Pending Allot Amount"] || row["15"]) || null;
            const pledge_unit = parseFloat(row["Pledge Unit"] || row["16"]) || null;
            const pending_red_swo_unit = parseFloat(row["Pending Red/SWO Unit"] || row["17"]) || null;
            const pending_red_swo_amount = parseFloat(row["Pending Red/SWO Amount"]|| row["18"]) || null;
            const dividend = parseFloat(row["Dividend"] || row["19"]) || null;
            const unrealized_gain_loss = parseFloat(row["Unrealized Gain/Loss"] || row["20"]) || null;
            const unrealized_gain_loss_percentage = parseFloat(row["Unrealized Gain/Loss (%)"] || row["21"]) || null;
            const average_cost = parseFloat(row["Average Cost"] || row["22"]) || null;
            const total_cost = parseFloat(row["Total Cost"] || row["23"]) || null;
            const nav = parseFloat(row["NAV"] || row["24"]) || null;
            const allocation_percentage = parseFloat(row["Allocation (%)"] || row["25"]) || null;
            const asOfDate = row["As of"] || null;

            if (!account_id || !amc || !fund_code) { // ตรวจสอบค่าที่จำเป็น
                console.warn("Skipping row due to missing required fields:", row);
                continue;
            }

            values.push([account_id, amc, unitholder_id, unitholder_type, ic, team, branch, fund_code, available_balance_unit, available_balance_amount, outstanding_balance_unit, outstanding_balance_amount, pending_allot_unit, pending_allot_amount, pledge_unit, pending_red_swo_unit, pending_red_swo_amount, dividend, unrealized_gain_loss, unrealized_gain_loss_percentage, average_cost, total_cost, nav, allocation_percentage, asOfDate,createDate]);
        }
        // console.log(values);
        if (values.length === 0) {
            return res.status(200).send("No valid data to insert after validation.");
        }

        // // บันทึกข้อมูลลงฐานข้อมูล
        const sql = `INSERT INTO wcc_aum (
            account_id, amc, unitholder_id, unitholder_type, ic, 
            team, branch, fund_code, available_balance_unit, available_balance_amount, 
            outstanding_balance_unit, outstanding_balance_amount, pending_allot_unit, pending_allot_amount, pledge_unit, 
            pending_red_swo_unit, pending_red_swo_amount, dividend, unrealized_gain_loss, unrealized_gain_loss_percentage, 
            average_cost, total_cost, nav, allocation_percentage, as_of, createDate) VALUES ?`;
            const [result] = await dbConnFCC.query(sql, [values]);
            
            console.log("Inserted " + result.affectedRows + " rows.");

            const groupByIC = groupByICAndSum(jsonData);
            // console.log(groupByIC); 
            await insertGroupedData(groupByIC,createDate);

            res.status(200).json({ success: true
                , data: groupByIC
                , message: "Data uploaded successfully" });
    } catch (error) {
        console.log(error);
        D.debugLog("Error: ", error.message);
        res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
});

router.get('/ic/:ic/:date',async function (req, res) {
    const ic = req.params.ic;
    const inputDate = req.params.date;
    D.debugLog("GET by ic >>>>>"+ic+" "+inputDate);
    try {
        // Query ข้อมูลจากฐานข้อมูล
        const [rows] = await dbConnFCC.query(
            `SELECT * 
             FROM wcc_TotalOutstandingBalance WHERE IC = ? AND createDate <= ? Order by id DESC LIMIT 5;`, 
            [ic, inputDate]);
        // ตรวจสอบผลลัพธ์
        if (rows.length > 0) {
            // มีข้อมูล พบข้อมูลที่ตรงกับเงื่อนไข
            res.status(200).json({ status: "OK", data: rows });
        } else {
            // ไม่พบข้อมูล
            res.status(404).json({ status: "Not Found", message: "Data not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
});
router.get('/team/:team/:date',async function (req, res) {
    const team = req.params.team;
    const inputDate = req.params.date;
    D.debugLog("GET by team >>>>>"+team+" "+inputDate);
    try {
        // Query ข้อมูลจากฐานข้อมูล
        const [rows] = await dbConnFCC.query(
            `SELECT * 
             FROM wcc_TotalOutstandingBalance WHERE IC = ? AND createDate <= ? Order by id DESC LIMIT 5;`, 
            [ic, inputDate]);
        // ตรวจสอบผลลัพธ์
        if (rows.length > 0) {
            // มีข้อมูล พบข้อมูลที่ตรงกับเงื่อนไข
            res.status(200).json({ status: "OK", data: rows });
        } else {
            // ไม่พบข้อมูล
            res.status(404).json({ status: "Not Found", message: "Data not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
});

// Function to group by IC and sum Outstanding Balance Amount
function groupByICAndSum(data) {
    return data.reduce((result, item) => {
      const ic = item.IC;
      if (!result[ic]) {
        result[ic] = 0;
      }
      result[ic] += parseFloat( item["Outstanding Balance Amount"]);
      return result;
    }, {});
}
async function insertGroupedData(groupedData, asOfDate) {
    try {
      // SQL statement template
      const sql = `
        INSERT INTO wcc_TotalOutstandingBalance (createDate, IC, TotalOutstandingBalanceAmount) 
        VALUES (?, ?, ?)
      `;
  
      // Loop through groupedData and insert each row
      for (const [ic, totalAmount] of Object.entries(groupedData)) {
        const values = [asOfDate, ic, totalAmount.toFixed(2)];
        const [result] = await dbConnFCC.query(sql, values);
        console.log(`Inserted IC: ${ic}, TotalAmount: ${totalAmount}, Result:`, result);
      }
      console.log("All data inserted successfully!");
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }

module.exports = router;