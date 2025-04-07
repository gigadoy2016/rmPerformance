const express = require('express');
const xl = require('excel4node');
const router = express.Router();
const {  txtLog } = require('../config/log');

router.get('/', function(req, res, next) {
    let user = {name_eng:'eng', lastname_eng:'l',target :1000,ic_code:'4400',}
    res.render('testexcel'
        , { title: 'WCC',name:'Excel',ipAPI:'test', data:user,permission:3}
    );
});

router.post('/export/', function(req, res, next) {
    txtLog("xls.js","============= test POST ==============");
    const data=  req.body.d;

    // console.log(data);
    try{
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    let json = JSON.parse(data);
    // res.json(data);
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1');
    var wsheet2 = wb.addWorksheet('Transactions');
    let fundCode = json.detail;
    // console.log(fundCode);

    let alignRight = wb.createStyle({alignment: {horizontal: 'right'}});
    let h1 = wb.createStyle({
            font: { bold: true, size: 14, vertAlign: 'center' },
            alignment: { horizontal: 'center', vertical: 'center' }
        });
    let heading = wb.createStyle({
            font: { bold: true, size: 12, vertAlign: 'center' },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { 
                left: { style: "thin" }, 
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            }
        });
    let contentStyle = wb.createStyle({
        border: { 
            left: { style: "thin" }, 
            right: { style: "thin" }
        }
    });
    let contentStyle1 = wb.createStyle({
        border: { 
            left: { style: "thin" }, 
            right: { style: "thin" },
            top: { style: "thin" },
            bottom: { style: "thin" }
        }
    });
    let footerStyle = wb.createStyle({
        border: { top: { style: "thin" }}
    });

    const currencyStyle2 = wb.createStyle({
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    const currencyStyle3 = wb.createStyle({
        numberFormat: '#,##0.00; (#,##0.00); -',
        border: { 
            left: { style: "thin" }, 
            right: { style: "thin" }
        }
    });
    ws.column(1).setWidth(30);
    ws.column(2).setWidth(14);
    ws.column(3).setWidth(14);
    ws.column(4).setWidth(14);
    ws.column(5).setWidth(14);
    ws.column(6).setWidth(25);
    ws.column(7).setWidth(25);
    

    ws.cell(1,1).string(json.first_name+" "+json.last_name+"(ic:"+json.ic+")"); 
    ws.cell(2,1).string("Performance report as of :"+json.reportAsOf);
    ws.cell(3,1).string("Start Date:"+month[json.month]+" "+json.year);
    ws.cell(4,1).string("*Allotted date T-2");

    ws.cell(2,6).string("IC:").style(alignRight);
    ws.cell(2,7).string(""+json.ic).style(alignRight);
    ws.cell(3,6).string("Target:").style(alignRight);
    ws.cell(3,7).number(json.target).style(currencyStyle2);

    ws.cell(5,6).string("Front end fee:").style(alignRight);
    // let FEFee = parseFloat(json.FEFee.replaceAll(',',''));
    let FEFee = parseCurrency(json.FEFee);
    ws.cell(5,7).number(FEFee).style(currencyStyle2);
    ws.cell(6,6).string("Trailing fee:").style(alignRight);
    // // let TFee = parseFloat(json.TFee.replaceAll(',',''));
    let TFee = parseCurrency(json.TFee);
    ws.cell(6,7).number(TFee).style(currencyStyle2);
    ws.cell(6,8).string(json.TFeeDate);
    ws.cell(7,6).string("Total fee:").style(alignRight);
    // // let totalFee = parseFloat(json.totalFee.replaceAll(',',''));
    let totalFee = parseCurrency(json.totalFee);
    ws.cell(7,7).number(totalFee).style(currencyStyle2);
    ws.cell(8,6).string("Performance:").style(alignRight);
    // // let performance = parseFloat(json.performance.replaceAll(',',''));
    // console.log(json.performance);
    let performance = parseCurrency(json.performance);
    ws.cell(8,7).string(performance).style(currencyStyle2);

    ws.cell(6,1).string("Allottment Transactions.").style(h1);
    ws.cell(11,1,12,1,true).string("Fund Code").style(heading);

    ws.cell(11,2,11,3,true).string("SUB").style(heading);
    ws.cell(11,4,11,5,true).string("SWI").style(heading);
    ws.cell(11,6,12,6,true).string("Total Amount").style(heading);
    ws.cell(11,7,12,7,true).string("Total Total Font End Fee").style(heading);

    ws.cell(12,2).string("Amount").style(heading);
    ws.cell(12,3).string("Front End Fee").style(heading);
    ws.cell(12,4).string("Amount").style(heading);
    ws.cell(12,5).string("Front End Fee").style(heading);

    let rows = fundCode;
    
    let Y = 13;
    // console.log(rows);
    //============ Allottment  Transactions. ============================
    for(let i=0; i < rows.length;i++){
        let row = rows[i];
        console.log(row);
        ws.cell(Y,1).string(row.fundcode).style(contentStyle);
        if(row.subAmount !== undefined){
            let amount = row.subAmount;
            ws.cell(Y,2).number(amount).style(currencyStyle3);
        }
        if(row.subFrontEndFee !== undefined){
            let FEFee = row.subFrontEndFee;
            ws.cell(Y,3).number(FEFee).style(currencyStyle3); 
        }
        if(row.swiAmount !== undefined){
            let amount = row.swiAmount;
            ws.cell(Y,4).number(amount).style(currencyStyle3);
        }
        if(row.swiFee !== undefined){
            let FEFee = row.swiFee;
            ws.cell(Y,5).number(FEFee).style(currencyStyle3);
        }
        let total_amount = 0;
        if(row.totalAmount !== undefined){
            total_amount = row.totalAmount;
        }
        ws.cell(Y,6).number(total_amount).style(currencyStyle3);

        let total_FEFee = 0;
        if(row.totalFrontEndFee !== undefined){
            total_FEFee = row.totalFrontEndFee;
        }
        ws.cell(Y,7).number(total_FEFee).style(currencyStyle3);
        Y=Y+1;
    }
    let sum = json.sum;

    if(json.sum !== undefined){
        ws.cell(Y,1).string("Grand Total").style(contentStyle1);
        ws.cell(Y,2).number(getCurrency(sum.sumAmountSUB)).style(currencyStyle3);
        ws.cell(Y,3).number(getCurrency(sum.sumFEFeeSUB)).style(currencyStyle3);
        ws.cell(Y,4).number(getCurrency(sum.sumAmountSWI)).style(currencyStyle3);
        ws.cell(Y,5).number(getCurrency(sum.sumFEFeeSWI)).style(currencyStyle3);
        ws.cell(Y,6).number(getCurrency(sum.sumAmount)).style(currencyStyle3);
        ws.cell(Y++,7).number(getCurrency(sum.sumFEFee)).style(currencyStyle3);
    }
    
    for(let i=1;i<8;i++){
        ws.cell(Y,i).string("").style(footerStyle);
    }
    //============ Waiting Transactions. ============================
    let waitingRows = json.data.waitting;
    if(waitingRows != undefined){
        Y = Y + 2;
        if(waitingRows.length > 0 ){
            ws.cell(Y++,1).string("Waiting Transactions.").style(h1);
            ws.cell(Y,1).string("Fund Code").style(heading);
            ws.cell(Y,2).string("amount").style(heading);
            ws.cell(Y,3).string("Type").style(heading);
            ws.cell(Y++,4).string("status").style(heading);
            
            for(let i=0;i < waitingRows.length; i++ ){
                let row = waitingRows[i];
                ws.cell(Y,1).string(row.fundcode).style(contentStyle);
                let amount = 0;
                if(row.amount !=="")
                    amount = parseCurrency(row.amount);
                ws.cell(Y,2).number(amount).style(currencyStyle2);
                ws.cell(Y,3).string(row.tranType).style(contentStyle);
                ws.cell(Y,4).string(row.status).style(contentStyle);
                Y = Y+1;
            }
            for(let i=1;i<5;i++){
                ws.cell(Y,i).string("").style(footerStyle);
            }
        }
    }
    //============End Waiting Transactions. ============================
    //============ Transaction Sheet ===================================
    const trans = json.trans;
    const currencyStyle = wb.createStyle({
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    wsheet2.column(2).setWidth(20);
    wsheet2.column(3).setWidth(15);
    wsheet2.column(6).setWidth(15);
    wsheet2.column(7).setWidth(15);
    wsheet2.column(8).setWidth(20);

    wsheet2.cell(1,1).string("Account ID");
    wsheet2.cell(1,2).string("Fund Code");
    wsheet2.cell(1,3).string("Amount");
    wsheet2.cell(1,4).string("Status");
    wsheet2.cell(1,5).string("Type");
    wsheet2.cell(1,6).string("Confirmed Amount");
    wsheet2.cell(1,7).string("Confirmed Units");
    wsheet2.cell(1,8).string("Transaction Date");
    wsheet2.cell(1,9).string("Settlement Date");
    wsheet2.cell(1,10).string("Amc Code");
    wsheet2.cell(1,11).string("Allotment Date");
    wsheet2.cell(1,12).string("NAV Date");
    wsheet2.cell(1,13).string("Alloted NAV");
    wsheet2.cell(1,14).string("Fee");
    wsheet2.cell(1,15).string("Withholding Tax");
    wsheet2.cell(1,16).string("VAT");
    wsheet2.cell(1,17).string("XWT Ref");
    wsheet2.cell(1,18).string("ic");

    for(let i=0; i < trans.length; i++){
        let y = i+2;
        const tran = trans[i];

        wsheet2.cell(y,1).string(antiUndentify(tran.account_id));
        wsheet2.cell(y,2).string(antiUndentify(tran.fund_code));
        wsheet2.cell(y,3).number(getCurrency(tran.amount)).style(currencyStyle);
        wsheet2.cell(y,4).string(antiUndentify(tran.status));
        wsheet2.cell(y,5).string(antiUndentify(tran.transaction_type));
        wsheet2.cell(y,6).number(getCurrency(tran.confirmed_amount)).style(currencyStyle);
        wsheet2.cell(y,7).number(getCurrency(tran.confirmed_units)).style(currencyStyle);
        wsheet2.cell(y,8).string(antiUndentify(tran.transaction_date));
        wsheet2.cell(y,9).string(antiUndentify(tran.settlement_date));
        wsheet2.cell(y,10).string(antiUndentify(tran.amc_code));
        wsheet2.cell(y,11).string(antiUndentify(tran.allotment_date));
        wsheet2.cell(y,12).string(antiUndentify(tran.nav_date));
        wsheet2.cell(y,13).number(getCurrency(tran.allotted_nav)).style(currencyStyle);
        wsheet2.cell(y,14).number(getCurrency(tran.fee)).style(currencyStyle);
        wsheet2.cell(y,15).number(getCurrency(tran.withholding_tax)).style(currencyStyle);
        wsheet2.cell(y,16).number(getCurrency(tran.vat)).style(currencyStyle);
        wsheet2.cell(y,17).string(antiUndentify(tran.xwt_reference_no));
        wsheet2.cell(y,18).string(antiUndentify(tran.ic));
    }
    let fileName = "IC"+json.ic+"_"+json.year +"_"+ month[json.month]+".xlsx";
    //wb.write('ExcelFile.xlsx', res);
    wb.write(fileName, res);
    }catch(error){
        console.log(error);
    }
    
});
router.post('/monthly/', function(req, res, next) {
    txtLog("xls.js","============= monthly POST ==============");
    const datas =  req.body.jsonData;
    const month = req.body.m;
    const year = req.body.year;
    const DATAs = JSON.parse(datas);
    const users = DATAs.users;

    console.log(DATAs);
    const monthS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    if(users != undefined){
        try{
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Sheet 1');

            const currencyStyle = wb.createStyle({
                numberFormat: '#,##0.00; (#,##0.00); -'
            });

            const redFont = wb.createStyle({font: { color: "red"}});
            const greenFont = wb.createStyle({font: { color: "green"}});

            ws.cell(1,1).string("RM Performance");
            ws.cell(1,6).string(monthS[month-1]+"-"+year);
            //===================================== Table Head(th) =========
            ws.cell(2,1).string("IC");
            ws.cell(2,2).string("Name");
            ws.cell(2,3).string("Target");
            ws.cell(2,4).string("Total Fee");
            ws.cell(2,5).string("Performance");
            ws.cell(2,6).string("Amount Waiting");
            //===================================== Table Body(td) =========
            for(let i=0;i < users.length; i++){
                const user = users[i];
                let indexRow = 3 + i;
                let totalFee = Math.floor(user.totalFee);
                let amountWaiting = Math.floor(user.amountWaiting);
                
                ws.cell(indexRow,1).string(user.ic);
                ws.cell(indexRow,2).string(user.name);
                ws.cell(indexRow,3).number(user.target).style(currencyStyle);
                ws.cell(indexRow,4).number(totalFee).style(currencyStyle);
                ws.cell(indexRow,5).string(Math.floor(totalFee).toLocaleString('en-US') + " / "+Math.floor(user.target).toLocaleString('en-US'));
                if(totalFee > user.target){
                    ws.cell(indexRow,4).style(greenFont);
                    ws.cell(indexRow,5).style(greenFont);
                }else{
                    ws.cell(indexRow,4).style(redFont);
                    ws.cell(indexRow,5).style(redFont);
                }
                
                ws.cell(indexRow,6).number(amountWaiting).style(currencyStyle);
            }
            //============End Waiting Transactions. ============================
            wb.write('RMPerformance.xlsx', res);
        }catch(err){
            res.status(200).send(err);        
        }
    }
});

function antiUndentify(txt){
    if(txt == undefined)
        txt = "";
    return txt;
}

// function getCurrency(txt){
//     let result = 0;
//     if(txt == undefined){
//         result =0;
//     }else if(txt === ""){
//         result =0;
//     }else{
//         // result = parseFloat(txt.replaceAll(',',''));
//         result = parseFloat(txt.replace(/,/g, ''));
//     }
//     return result;
// }
function getCurrency(txt) {
    let result = 0;
    if (txt == null) { // ครอบคลุมทั้ง null และ undefined
        result = 0;
    } else if (txt === "") {
        result = 0;
    } else if (typeof txt === "number") {
        result = txt;
    } else if (typeof txt === "string") {
        result = parseFloat(txt.replace(/,/g, ""));
    } else {
        throw new Error("Unsupported input type: " + typeof txt);
    }
    return result;
}
// router.post('/monthly/', function(req, res, next) {
//     const datas =  req.body.jsonData;
//     res.status(200).json( JSON.parse(datas));

function parseCurrency(value) {
    try {
      // ตรวจสอบว่าค่าเป็นสตริงหรือไม่
      if (typeof value !== "string") {
        throw new Error("Input must be a string");
      }
  
      // ลบเครื่องหมายคั่นหลักพัน (`,`)
      const sanitizedValue = value.replace(/,/g, "");
  
      // แปลงค่าเป็นตัวเลข
      const number = parseFloat(sanitizedValue);
  
      // ตรวจสอบว่าผลลัพธ์เป็นตัวเลขหรือไม่
      if (isNaN(number)) {
        throw new Error("Invalid number format");
      }
  
      return number; // คืนค่าตัวเลข
    } catch (error) {
      console.error(error.message); // แสดงข้อความ error ใน console
      return null; // คืนค่า null หากเกิดข้อผิดพลาด
    }
}

module.exports = router