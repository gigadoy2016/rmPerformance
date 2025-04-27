"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranQuery = void 0;
var Transaction_1 = require("./Transaction");
var Debug_1 = require("./Debug");
// import { connection } from '../config/dbConfig';
var TranQuery = /** @class */ (function (_super) {
    __extends(TranQuery, _super);
    function TranQuery(datas) {
        var _this = _super.call(this) || this;
        _this.datas = [];
        _this.debug = new Debug_1.Debug(true, "TranQuery.ts");
        _this.tran = new Transaction_1.Transaction();
        _this.fieldSelect = "SELECT \n            DATE_FORMAT(T.transaction_date, '%d/%m/%Y %H:%i') transaction_date\n            ,T.transaction_type \n            ,T.fund_code \n            ,T.account_id\n            ,T.ic\n            ,T.status \n            ,FORMAT(ROUND(T.confirmed_units, 2), 2, 'th_TH') AS confirmed_units\n            ,FORMAT(ROUND(T.amount, 2), 2, 'th_TH') AS amount\n            ,FORMAT(ROUND(T.confirmed_amount, 2), 2, 'th_TH') AS confirmed_amount\n            ,T.amc_code \n            ,T.settlement_bank\n            ,T.customer_name \n            ,T.status\n            ,DATE_FORMAT(T.effective_date, '%d/%m/%Y') effective_date\n            ,T.settlement_bank_account\n            ,DATE_FORMAT(T.allotment_date, '%d/%m/%Y') allotment_date\n            ,DATE_FORMAT(T.nav_date, '%d/%m/%Y') nav_date\n            ,FORMAT(ROUND(T.fee, 2), 2, 'th_TH') AS fee\n            ,FORMAT(ROUND(T.vat, 2), 2, 'th_TH') AS vat \n            ,FORMAT(ROUND(T.allotted_nav, 2), 2, 'th_TH') AS allotted_nav\n            ,FORMAT(ROUND(T.withholding_tax, 2), 2, 'th_TH') AS withholding_tax\n            ,DATE_FORMAT(T.settlement_date, '%d/%m/%Y') settlement_date\n            ,T.settlement_bank \n            ,AMC.selling_fee \n            ,AMC.rm_sharing \n            ,AMC.sa_sharing \n            ,(T.fee * 0.03) wh3 \n            ,order_reference\n            ,xwt_reference_no\n            ,counter_payment_type\n            ,counter_fund_code \n        FROM transactions T LEFT JOIN   \n            funds AMC \n            ON T.fund_code = AMC.fund_code ";
        _this.datas = datas;
        return _this;
    }
    TranQuery.prototype.getTransactionByDate = function (startDate, endDate) {
        var SQL = "SELECT \n            DATE_FORMAT(T.transaction_date, '%d/%m/%Y %H:%i') transaction_date\n            ,T.transaction_type \n            ,T.fund_code \n            ,T.account_id\n            ,T.ic\n            ,T.status \n            ,FORMAT(ROUND(T.confirmed_units, 2), 2, 'th_TH') AS confirmed_units\n            ,FORMAT(ROUND(T.amount, 2), 2, 'th_TH') AS amount\n            ,FORMAT(ROUND(T.confirmed_amount, 2), 2, 'th_TH') AS confirmed_amount\n            ,T.amc_code \n            ,T.settlement_bank\n            ,T.customer_name \n            ,T.status\n            ,DATE_FORMAT(T.effective_date, '%d/%m/%Y') effective_date\n            ,T.settlement_bank_account\n\t\t    ,DATE_FORMAT(T.allotment_date, '%d/%m/%Y') allotment_date\n            ,DATE_FORMAT(T.nav_date, '%d/%m/%Y') nav_date\n            ,FORMAT(ROUND(T.fee, 2), 2, 'th_TH') AS fee\n            ,FORMAT(ROUND(T.vat, 2), 2, 'th_TH') AS vat \n            ,FORMAT(ROUND(T.allotted_nav, 2), 2, 'th_TH') AS allotted_nav\n            ,FORMAT(ROUND(T.withholding_tax, 2), 2, 'th_TH') AS withholding_tax\n            ,DATE_FORMAT(T.settlement_date, '%d/%m/%Y') settlement_date\n            ,T.settlement_bank \n\t\t    ,AMC.selling_fee \n            ,AMC.rm_sharing \n            ,AMC.sa_sharing \n            ,(T.fee * 0.03) wh3 \n            ,order_reference\n            ,xwt_reference_no\n            ,counter_payment_type\n            ,counter_fund_code \n        FROM transactions T LEFT JOIN   \n            funds AMC \n            ON T.fund_code = AMC.fund_code ";
        SQL += "WHERE T.transaction_date BETWEEN  STR_TO_DATE('" + startDate + " 00:01','%Y-%m-%d %H:%i') AND STR_TO_DATE('" + endDate + " 23:59','%Y-%m-%d %H:%i')";
        // SQL += "WHERE T.allotment_date BETWEEN  STR_TO_DATE('"+startDate+" 00:01','%Y-%m-%d %H:%i') AND STR_TO_DATE('"+endDate+" 23:59','%Y-%m-%d %H:%i')"
        SQL += " AND (T.status='ALLOTTED' OR T.status='WAITING' OR T.status='SUBMITTED' OR T.status='APPROVED') ";
        // SQL += " AND (T.transaction_type = 'SUB' OR T.transaction_type = 'SWI' )";
        SQL += " AND (T.transaction_type = 'SUB' OR T.transaction_type = 'SWI' OR T.transaction_type = 'RED')";
        // this.debug.debugLog(SQL);
        return SQL;
    };
    TranQuery.prototype.getTranByAllotmentDate = function (ic, startDate, endDate) {
        // this.debug.debugLog(">>>> Function  getTransactionByAllotmentDate():"+startDate+"-"+endDate);
        var SQL = "SELECT \n            DATE_FORMAT(T.transaction_date, '%d/%m/%Y %H:%i') transaction_date\n            ,T.transaction_type \n            ,T.fund_code \n            ,T.account_id\n            ,T.ic\n            ,T.status \n            ,FORMAT(ROUND(T.confirmed_units, 2), 2, 'th_TH') AS confirmed_units\n            ,FORMAT(ROUND(T.amount, 2), 2, 'th_TH') AS amount\n            ,FORMAT(ROUND(T.confirmed_amount, 2), 2, 'th_TH') AS confirmed_amount\n            ,T.amc_code \n            ,T.settlement_bank\n            ,T.customer_name \n            ,T.status\n            ,DATE_FORMAT(T.effective_date, '%d/%m/%Y') effective_date\n            ,T.settlement_bank_account\n\t\t    ,DATE_FORMAT(T.allotment_date, '%d/%m/%Y') allotment_date\n            ,DATE_FORMAT(T.nav_date, '%d/%m/%Y') nav_date\n            ,FORMAT(ROUND(T.fee, 2), 2, 'th_TH') AS fee\n            ,FORMAT(ROUND(T.vat, 2), 2, 'th_TH') AS vat \n            ,FORMAT(ROUND(T.allotted_nav, 2), 2, 'th_TH') AS allotted_nav\n            ,FORMAT(ROUND(T.withholding_tax, 2), 2, 'th_TH') AS withholding_tax\n            ,DATE_FORMAT(T.settlement_date, '%d/%m/%Y') settlement_date\n            ,T.settlement_bank \n\t\t    ,AMC.selling_fee \n            ,AMC.rm_sharing \n            ,AMC.sa_sharing \n            ,(T.fee * 0.03) wh3 \n            ,order_reference\n            ,xwt_reference_no\n            ,counter_payment_type\n            ,counter_fund_code \n        FROM transactions T LEFT JOIN   \n            funds AMC \n            ON T.fund_code = AMC.fund_code ";
        SQL += "WHERE T.allotment_date BETWEEN  STR_TO_DATE('" + startDate + "','%Y-%m-%d') AND STR_TO_DATE('" + endDate + "','%Y-%m-%d')";
        SQL += " AND (T.status='ALLOTTED' OR T.status='WAITING' OR T.status='SUBMITTED' OR T.status='APPROVED') ";
        SQL += " AND (T.transaction_type = 'SUB' OR T.transaction_type = 'SWI') AND ic='" + ic + "'";
        this.debug.debugLog(SQL);
        return SQL;
    };
    TranQuery.prototype.getTransactionByIC = function (startDate, endDate, ic) {
        var SQL = this.getTransactionByDate(startDate, endDate);
        SQL += " AND ic='" + ic + "'";
        console.log(SQL);
        return SQL;
    };
    TranQuery.prototype.getTransactions = function (iccode, startDate, endDate) {
        this.debug.debugLog(">>>> Function  getTransactions():" + startDate + "-" + endDate);
        var SQL = this.getTransactionByDate(startDate, endDate) + " AND ic = '" + iccode + "' ";
        this.debug.debugLog(SQL);
        return SQL;
    };
    TranQuery.prototype.getTransactionsByTeam = function (team, startDate, endDate) {
        var member = team.join(',');
        // this.debug.debugLog(">>>> Function  getTransactionsByTeam():"+startDate+"-"+endDate);
        var SQL = this.getTransactionByDate(startDate, endDate)
            + " AND ic IN (" + member + ") ";
        // this.debug.debugLog(SQL);
        return SQL;
    };
    TranQuery.prototype.genSqlInsert = function () {
        // console.log(this.datas[0]);
        if (this.datas <= 0) {
            return "Data not found;";
        }
        var SQL = "INSERT INTO transactions (";
        // let attributes = Object.getOwnPropertyNames(this.datas[0]);
        var attributes = Object.getOwnPropertyNames(this.tran.mappingField);
        var count = attributes.length;
        console.log(attributes);
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var attribute = attributes[i];
                var att = this.mappingField[attribute];
                // console.log(attribute+" = "+att);
                if (att !== undefined) {
                    SQL += "`" + att + "` ,";
                }
            }
            SQL = SQL.slice(0, -1) + " ) VALUES ";
        }
        else {
            return "Err: Data Not Found!!;";
        }
        return SQL + this.genValues();
    };
    TranQuery.prototype.genSqlUpdate = function () {
        var ans = '';
        // console.log(this.datas);
        if (this.datas <= 0) {
            return "Data not found;";
        }
        for (var i = 0; i < this.datas.length; i++) {
            var tran = this.datas[i];
            console.log(tran);
            var SQL = "UPDATE transactions SET ";
            SQL += "status='" + tran["Status"] + "' ";
            if (tran["Unit"] == "") {
                SQL += ",unit=null ";
            }
            else {
                SQL += ",unit='" + tran["Unit"] + "' ";
            }
            SQL += ",confirmed_amount = '" + tran["Confirmed Amount"] + "' ";
            SQL += ",confirmed_units = '" + tran["Confirmed Units"] + "' ";
            SQL += ",approver = '" + tran["Approver"] + "' ";
            SQL += ",last_update = STR_TO_DATE('" + tran["Last Update"] + "', '%d/%m/%Y %H:%i' ) ";
            SQL += ",allotment_date = STR_TO_DATE('" + tran["Allotment Date"] + "', '%d/%m/%Y') ";
            SQL += ",nav_date = STR_TO_DATE('" + tran["NAV Date"] + "', '%d/%m/%Y') ";
            SQL += ",fee='" + tran["Fee"] + "' ";
            SQL += ",withholding_tax='" + tran["Withholding Tax"] + "' ";
            SQL += ",vat='" + tran["VAT"] + "' ";
            SQL += ",allotted_nav='" + tran["Allotted NAV"] + "' ";
            SQL += ",order_ref='" + tran["Order Referral"] + "' ";
            SQL += ",team='" + tran["Team"] + "' ";
            SQL += "WHERE ";
            SQL += "transaction_id='" + tran["Transaction ID"] + "' ";
            SQL += "AND transaction_type ='" + tran["Transaction Type"] + "' ";
            SQL += "AND fund_code ='" + tran["Fund Code"] + "' ";
            SQL += "AND account_id ='" + tran["Account ID"] + "' ";
            SQL += "AND unitholder_id ='" + tran["Unitholder ID"] + "';";
            ans += SQL;
        }
        return ans;
    };
    TranQuery.prototype.genValues = function () {
        //let data = "";
        // let attributes = Object.getOwnPropertyNames(this.datas[0]);
        var columns = Object.getOwnPropertyNames(this.tran.mappingField);
        var sql = " (";
        for (var j = 0; j < this.datas.length; j++) {
            // let value:any = [];
            // let attributes = Object.getOwnPropertyNames(this.datas[j]);
            for (var i = 0; i < columns.length; i++) {
                var attribute = columns[i];
                var att = this.mappingField[attribute];
                var data = this.datas[j][attribute];
                if (att !== undefined) {
                    // == DateTime
                    // console.log(att);
                    if (att === 'transaction_date' || att === 'last_update') {
                        data = "STR_TO_DATE('" + data + "','%d/%m/%Y %H:%i')";
                        sql += " " + data + " ,";
                        // == Date
                    }
                    else if (att === 'effective_date' || att === 'settlement_date' || att === 'cheque_date' ||
                        att === 'allotment_date' || att === 'nav_date') {
                        if (data !== '') {
                            data = "STR_TO_DATE('" + data + "','%d/%m/%Y')";
                            sql += " " + data + ",";
                        }
                        else {
                            sql += " NULL,";
                        }
                    }
                    else if (att === 'approver') {
                        //console.log(att + "==="+ data + "|"+(data == undefined) +"|"+ this.datas[j]['Transaction ID']);
                        if (data === undefined || data == 'undefined') {
                            sql += " NULL ,";
                        }
                        else {
                            sql += " '" + data + "',";
                        }
                        // == Decimal
                    }
                    else if (att === 'amount' || att === 'unit' || att === 'confirmed_amount' || att === 'confirmed_units' ||
                        att === 'fee' || att === 'withholding_tax' || att === 'vat' || att === 'allotted_nav' ||
                        att === 'adls_fee' || att === 'liquidity_fee') {
                        //SQL += "`" + att + "` ,";
                        if (data === '' || data === undefined) {
                            sql += " NULL ,";
                        }
                        else {
                            sql += " " + data + ",";
                        }
                    }
                    else {
                        if (data === undefined || data == 'undefined') {
                            sql += " NULL ,";
                        }
                        else {
                            sql += " '" + data + "',";
                        }
                    }
                }
            }
            // values.push(value);
            sql = sql.slice(0, -1);
            if (j == (this.datas.length - 1)) {
                sql += ");";
            }
            else {
                sql += "),(";
            }
        }
        // console.log(sql);
        return sql;
    };
    return TranQuery;
}(Transaction_1.Transaction));
exports.TranQuery = TranQuery;
// let datas = [{"Transaction Date":"01/02/2023 09:28","Account ID":"OM00119","Unitholder ID":"077400000071","Type":"OMN","Customer Name":"นาง มนวิภา เพ็ชรสุวรรณ","Transaction Type":"SUB","Registrar Flag":"","Fund Code":"ASP-DPLUS","ISIN":"TH7710010003","Cut-off Time":"15:30","Currency":"THB","Amount":100,"Unit":"","Sell All Unit":"","Status":"ALLOTTED","Confirmed Amount":100,"Confirmed Units":9.2158,"Effective Date":"01/02/2023","Settlement Date":"01/02/2023","Transaction ID":"2282302010341519","Payment Type":"TRN_SA","Bank/Issued By":"SCB","Bank Account/Credit No./Point Code":"0493147974","Approval Code":"","Cheque Date":"","Cheque No":"","Cheque Branch":"","Reject Reason":"","AMC Code":"ASSETFUND","PT":"N","IC":"4100","IC Branch":"400","Approver":"prakop.a","Last Update":"01/02/2023 20:34","Referral":"สุดคนึง หงส์ลดา","Settlement Bank":"SCB","Settlement Bank Account":"0493129120","Allotment Date":"01/02/2023","NAV Date":"01/02/2023","Investor Payment Instructor":"","Investor Payment Status":"","Fund Settlement Flag":"Y","Finnet Processing Type":"","Order Referral":"","Recurring Flag":"N","SA Recurring Order Reference No":"","Fee":0,"Withholding Tax":0,"VAT":0,"BCP":"N","Channel":"MKT","Reason to sell LTF/RMF":"","Allotted NAV":10.8509,"V.+ Order Ref. / AMC Order Ref.":"007723000190"},{"Transaction Date":"01/02/2023 09:30","Account ID":"OM00119","Unitholder ID":"9000000839","Type":"OMN","Customer Name":"นาง มนวิภา เพ็ชรสุวรรณ","Transaction Type":"SUB","Registrar Flag":"","Fund Code":"KFCASH-A","ISIN":"TH2759010006","Cut-off Time":"15:30","Currency":"THB","Amount":500,"Unit":"","Sell All Unit":"","Status":"ALLOTTED","Confirmed Amount":500,"Confirmed Units":37.3081,"Effective Date":"01/02/2023","Settlement Date":"01/02/2023","Transaction ID":"2282302010341520","Payment Type":"TRN_SA","Bank/Issued By":"SCB","Bank Account/Credit No./Point Code":"0493147974","Approval Code":"","Cheque Date":"","Cheque No":"","Cheque Branch":"","Reject Reason":"","AMC Code":"KSAM","PT":"N","IC":"4100","IC Branch":"400","Approver":"prakop.a","Last Update":"02/02/2023 08:22","Referral":"สุดคนึง หงส์ลดา","Settlement Bank":"SCB","Settlement Bank Account":"0593043240","Allotment Date":"01/02/2023","NAV Date":"01/02/2023","Investor Payment Instructor":"","Investor Payment Status":"","Fund Settlement Flag":"Y","Finnet Processing Type":"","Order Referral":"","Recurring Flag":"N","SA Recurring Order Reference No":"","Fee":0,"Withholding Tax":0,"VAT":0,"BCP":"N","Channel":"MKT","Reason to sell LTF/RMF":"","Allotted NAV":13.4019,"V.+ Order Ref. / AMC Order Ref.":"20230203201961"}];
// let test = new TranQuery(datas);
// console.log(test.getTransactionByDate("01/02/2023","10/02/2023"));
