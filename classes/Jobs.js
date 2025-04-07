"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
var dbConfig_1 = require("../config/dbConfig");
var Debug_1 = require("./Debug");
var Employee_1 = require("./Employee");
var nodemailer = require("nodemailer");
var Job = /** @class */ (function () {
    function Job() {
        this.debug = new Debug_1.Debug(true, "Class Jobs.ts");
        this.messageMail = [
            { id: 1, subject: "RM new Mission", msssage: "นี้คือ E-mail อัตโนมัติตอนนี้มี mission ที่ถูกสร้างโดย RM มาให้ท่านพิจารณา  \n\n ถ้าต้องการดูรายละเอียดให้กด Link ด้านล่างนี้ \n" }
        ];
    }
    Job.prototype.createJob = function (ic_code, customerType, customerName, customerId, target, message, email, target_time, target_time2, approval_id) {
        return __awaiter(this, void 0, void 0, function () {
            var date, status, S1, SQL, result, approver, msg, param, encode, Email, textMsg, subject, mail, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("method: CreateJob");
                        date = this.debug.showTime();
                        status = "CREATE";
                        message = this.debug.antiQuote(message);
                        S1 = "SELECT employee_id ,name_eng ,email  FROM employees WHERE employee_id ='" + approval_id + "'";
                        SQL = "INSERT INTO rm_jobs(customer_name,customer_id,customer_type,ic,text,target,created,status,target_time,target_time2,approver,enable\n        ) VALUES(\n            '".concat(customerName, "','").concat(customerId, "','").concat(customerType, "','").concat(ic_code, "','").concat(message, "','").concat(target, "','").concat(date, "','").concat(status, "','").concat(target_time, "','").concat(target_time2, "','").concat(approval_id, "','1')");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, dbConfig_1.dbConnection.query(S1)];
                    case 2:
                        approver = _a.sent();
                        approver = approver[0];
                        // console.log(approver[0]);
                        console.log("--------------------------------------------------------------------------");
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 3:
                        // console.log(SQL);
                        result = _a.sent();
                        if (!(approver.length > 0)) return [3 /*break*/, 5];
                        msg = this.messageMail[0];
                        param = ic_code + "|" + date;
                        encode = btoa(param);
                        Email = approver[0].email;
                        textMsg = msg.msssage + "\nApproved link:http://" + dbConfig_1.HOSTIP + "/job/approve/" + encode;
                        subject = "RM รหัส(" + ic_code + ") action plan เพื่ออนุมัติ";
                        return [4 /*yield*/, this.sendMail(subject, textMsg, Email)];
                    case 4:
                        mail = _a.sent();
                        this.debug.Log(Email + " Send mail:");
                        return [3 /*break*/, 6];
                    case 5:
                        this.debug.Log("Can not found sender Email !!");
                        _a.label = 6;
                    case 6: return [2 /*return*/, result];
                    case 7:
                        err_1 = _a.sent();
                        console.log(err_1);
                        this.debug.Log("error !!");
                        return [2 /*return*/, "0"];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.editJob = function (job_id, ic_code, customerType, customerName, customerId, target, message, target_time, target_time2, approval_id, create_time) {
        return __awaiter(this, void 0, void 0, function () {
            var date, status, S1, SQL, result, approver, msg, param, encode, Email, textMsg, subject, mail, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("method: EditJob");
                        date = this.debug.convertDate(create_time);
                        status = "CREATE";
                        message = this.debug.antiQuote(message);
                        S1 = "SELECT employee_id ,name_eng ,email  FROM employees WHERE employee_id ='" + approval_id + "'";
                        SQL = "UPDATE rm_jobs SET \n          customer_name ='".concat(customerName, "' \n          ,customer_id  ='").concat(customerId, "'\n          ,customer_type  ='").concat(customerType, "'\n          ,text  ='").concat(message, "'\n          ,target  ='").concat(target, "'\n          ,status  ='").concat(status, "'\n          ,target_time  ='").concat(target_time, "'\n          ,target_time2  ='").concat(target_time2, "'\n          WHERE job_id='").concat(job_id, "'");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, dbConfig_1.dbConnection.query(S1)];
                    case 2:
                        approver = _a.sent();
                        approver = approver[0];
                        // console.log(approver[0]);
                        console.log("--------------------------------------------------------------------------");
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 3:
                        // console.log(SQL);
                        result = _a.sent();
                        if (!(approver.length > 0)) return [3 /*break*/, 5];
                        msg = this.messageMail[0];
                        param = ic_code + "|" + date;
                        this.debug.Log(param);
                        encode = btoa(param);
                        Email = approver[0].email;
                        textMsg = msg.msssage + "\nApproved link:http://" + dbConfig_1.HOSTIP + "/job/approve/" + encode;
                        subject = "RM รหัส(" + ic_code + ") ได้แก้ไขกิจกรรมใหม่เพื่ออนุมัติ";
                        return [4 /*yield*/, this.sendMail(subject, textMsg, Email)];
                    case 4:
                        mail = _a.sent();
                        this.debug.Log(Email + " Send mail:");
                        return [3 /*break*/, 6];
                    case 5:
                        this.debug.Log("Can not found sender Email !!");
                        _a.label = 6;
                    case 6: return [2 /*return*/, result];
                    case 7:
                        err_2 = _a.sent();
                        console.log(err_2);
                        this.debug.Log("error !!");
                        return [2 /*return*/, "0"];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.loadJobs = function (ic_code, permission, month, year) {
        return __awaiter(this, void 0, void 0, function () {
            var codition_1, SQL, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log(ic_code + " permission: " + permission);
                        codition_1 = "";
                        if (permission === '1') {
                            codition_1 = "AND ic='" + ic_code + "' ";
                        }
                        else if (permission === '2') {
                            codition_1 = "AND (ic='" + ic_code + "' OR approver='" + ic_code + "') ";
                        }
                        else if (permission === undefined) {
                            codition_1 = "AND ic='" + ic_code + "' ";
                        }
                        SQL = "SELECT job_id,customer_name ,customer_id ,customer_type ,ic, text ,target \n                ,created, status ,approver, target_time, target_time2 \n                FROM rm_jobs WHERE enable > 0 AND status <> \"END\"  \n                AND (target_time BETWEEN '".concat(year, "-").concat(month, "-01' AND LAST_DAY('").concat(year, "-").concat(month, "-01')) \n                ").concat(codition_1, "  ORDER BY created DESC");
                        this.debug.Log("Method loadJobs :" + ic_code);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 3:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [2 /*return*/, 0];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.sendMail = function (mailSubject, message, mailTo) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter, mailOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("function sendMail");
                        transporter = nodemailer.createTransport({
                            service: dbConfig_1.mailLogin.service,
                            auth: {
                                user: dbConfig_1.mailLogin.auth.user,
                                pass: dbConfig_1.mailLogin.auth.pass
                            }
                        });
                        mailOptions = {
                            from: 'wealthconcept@gmail.com',
                            to: mailTo,
                            subject: mailSubject,
                            text: message
                        };
                        console.log(mailOptions);
                        return [4 /*yield*/, transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    // console.log(error);
                                    return error;
                                }
                                else {
                                    // console.log('Email sent: ' + info.response);
                                    return 'Email sent: ' + info.response;
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Job.prototype.select = function (ic_code, date) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, result, approval_id, emp, approver, jobOwnner, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SQL = "SELECT job_id,customer_name ,customer_id ,customer_type ,ic,text ,target \n      ,created, status ,approver,DATE_FORMAT(target_time , '%d/%m/%Y') target_time, DATE_FORMAT(target_time2 , '%d/%m/%Y') target_time2 \n      FROM rm_jobs WHERE ic='".concat(ic_code, "' AND created='").concat(date, "'");
                        this.debug.Log("method select :" + ic_code);
                        console.log(SQL);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        approval_id = result[0][0].approver;
                        emp = new Employee_1.Employee();
                        return [4 /*yield*/, emp.getEmployee(approval_id)];
                    case 3:
                        approver = _a.sent();
                        if (approver.length > 0) {
                            result[0][0].approver = approver[0].name_th + " " + approver[0].lastname_th;
                            result[0][0].approval_id = approval_id;
                        }
                        return [4 /*yield*/, emp.getEmployee(ic_code)];
                    case 4:
                        jobOwnner = _a.sent();
                        if (jobOwnner.length > 0) {
                            result[0][0].ownner = jobOwnner[0].name_th + " " + jobOwnner[0].lastname_th;
                        }
                        // console.log(result[0]);
                        return [2 /*return*/, result[0]];
                    case 5:
                        err_4 = _a.sent();
                        console.log(err_4);
                        return [2 /*return*/, 0];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.selectByID = function (ic_code, job_id) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, result, approval_id, emp, approver, jobOwnner, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SQL = "SELECT job_id,customer_name ,customer_id ,customer_type ,ic,text ,target \n      ,created, status ,approver,DATE_FORMAT(target_time , '%d/%m/%Y') target_time, DATE_FORMAT(target_time2 , '%d/%m/%Y') target_time2 \n      FROM rm_jobs WHERE ic='".concat(ic_code, "' AND job_id='").concat(job_id, "'");
                        // console.log(SQL);
                        this.debug.Log("method selectByID :" + ic_code);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        approval_id = result[0][0].approver;
                        emp = new Employee_1.Employee();
                        return [4 /*yield*/, emp.getEmployee(approval_id)];
                    case 3:
                        approver = _a.sent();
                        if (approver.length > 0) {
                            result[0][0].approver = approver[0].name_th + " " + approver[0].lastname_th;
                            result[0][0].approval_id = approval_id;
                        }
                        return [4 /*yield*/, emp.getEmployee(ic_code)];
                    case 4:
                        jobOwnner = _a.sent();
                        if (jobOwnner.length > 0) {
                            result[0][0].ownner = jobOwnner[0].name_th + " " + jobOwnner[0].lastname_th;
                        }
                        // console.log(result[0]);
                        return [2 /*return*/, result[0]];
                    case 5:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [2 /*return*/, 0];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.findByID = function (job_id) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, result, approval_id, emp, approver, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SQL = "SELECT job_id,customer_name ,customer_id ,customer_type ,ic,text ,target \n      ,created, status ,approver,DATE_FORMAT(target_time , '%d/%m/%Y') target_time, DATE_FORMAT(target_time2 , '%d/%m/%Y') target_time2 \n      FROM rm_jobs WHERE job_id='".concat(job_id, "'");
                        // console.log(SQL);
                        this.debug.Log("method selectByID :" + job_id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        approval_id = result[0][0].approver;
                        emp = new Employee_1.Employee();
                        return [4 /*yield*/, emp.getEmployee(approval_id)];
                    case 3:
                        approver = _a.sent();
                        if (approver.length > 0) {
                            result[0][0].approver = approver[0].name_th + " " + approver[0].lastname_th;
                            result[0][0].approval_id = approval_id;
                        }
                        // console.log(result[0]);
                        return [2 /*return*/, result[0]];
                    case 4:
                        err_6 = _a.sent();
                        console.log(err_6);
                        return [2 /*return*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.approvedJob = function (job_id, approval_id) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, result, job, emp, subject, msg, param, encoded, textMsg, aws, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("function approvedJob");
                        SQL = "UPDATE rm_jobs SET status = 'APPROVED' WHERE job_id ='" + job_id + "'";
                        this.debug.Log(SQL);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, this.findByID(job_id)];
                    case 3:
                        job = _a.sent();
                        return [4 /*yield*/, new Employee_1.Employee().getEmployeeByID(job[0].ic)];
                    case 4:
                        emp = _a.sent();
                        if (!(emp.length > 0)) return [3 /*break*/, 6];
                        subject = "RM Job หมายเลข" + job_id + "ได้ถูกอนุมัติแล้ว";
                        msg = "RM Job " + job_id + "ถูก Approved เรียบร้อยแล้ว\n  ";
                        param = job[0].ic + "|" + job_id;
                        encoded = btoa(param);
                        textMsg = msg + "\nRead link:http://" + dbConfig_1.HOSTIP + "/job/read/" + encoded;
                        return [4 /*yield*/, this.sendMail(subject, textMsg, emp[0].email)];
                    case 5:
                        aws = _a.sent();
                        // this.debug.Log(""+aws);
                        return [2 /*return*/, "1"];
                    case 6:
                        this.debug.Log("ไม่พบ Employee :" + job[0].ic);
                        return [2 /*return*/, "0"];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_7 = _a.sent();
                        console.log(err_7);
                        return [2 /*return*/, "0"];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.rejectJob = function (job_id, approval_id) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, result, job, emp, subject, msg, param, encoded, textMsg, aws, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("function rejectJob");
                        SQL = "UPDATE rm_jobs SET status = 'REJECTED' WHERE job_id ='" + job_id + "' AND ic='" + approval_id + "'";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, this.findByID(job_id)];
                    case 3:
                        job = _a.sent();
                        return [4 /*yield*/, new Employee_1.Employee().getEmployeeByID(job[0].ic)];
                    case 4:
                        emp = _a.sent();
                        if (!(emp.length > 0)) return [3 /*break*/, 6];
                        subject = "RM Job หมายเลข" + job_id + "ได้ถูกปฏิเสธการอนุมัติแล้ว";
                        msg = "RM Job " + job_id + "ได้ถูกปฏิเสธการอนุมัติแล้ว\n  ";
                        param = job[0].ic + "|" + job_id;
                        encoded = btoa(param);
                        textMsg = msg + "\nRead link:http://" + dbConfig_1.HOSTIP + "/job/read/" + encoded;
                        return [4 /*yield*/, this.sendMail(subject, textMsg, emp[0].email)];
                    case 5:
                        aws = _a.sent();
                        // this.debug.Log(""+aws);
                        return [2 /*return*/, "1"];
                    case 6:
                        this.debug.Log("ไม่พบ Employee :" + job[0].ic);
                        return [2 /*return*/, "0"];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_8 = _a.sent();
                        console.log(err_8);
                        return [2 /*return*/, "0"];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.successJob = function (job_id, approval_id) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, result, job, emp, rm, rm_name, subject, msg, detail, aws, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("function successJob");
                        SQL = "UPDATE rm_jobs SET status = 'SUCCESS' WHERE job_id ='" + job_id + "' ";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, this.findByID(job_id)];
                    case 3:
                        job = _a.sent();
                        return [4 /*yield*/, new Employee_1.Employee().getEmployeeByID(approval_id)];
                    case 4:
                        emp = _a.sent();
                        return [4 /*yield*/, new Employee_1.Employee().getEmployeeByID(job[0].ic)];
                    case 5:
                        rm = _a.sent();
                        rm_name = rm[0].name_th + ' ' + rm[0].lastname_th;
                        subject = "RM Job" + job_id;
                        msg = "RM Job_" + job_id + "ถูก Success เรียบร้อยแล้ว \n";
                        detail = "RM : ".concat(rm_name, "\n\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 : ").concat(job[0].customer_name, " \nDetail : ").concat(job[0].text, "\n target : ").concat(job[0].target, " ");
                        msg = msg + detail;
                        return [4 /*yield*/, this.sendMail(subject, msg, emp[0].email)];
                    case 6:
                        aws = _a.sent();
                        // this.debug.Log(""+aws);
                        return [2 /*return*/, "1"];
                    case 7:
                        err_9 = _a.sent();
                        console.log(err_9);
                        return [2 /*return*/, "0"];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Job.prototype.reportJobs = function (month) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, result, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SQL = "SELECT job_id,customer_name ,customer_id ,customer_type ,ic, text ,target \n                ,created, status ,approver, target_time, target_time2 \n                FROM rm_jobs WHERE enable > 0 AND status <> \"END\"  \n                AND (target_time BETWEEN '".concat(month, "-01' AND LAST_DAY('").concat(month, "-01')) \n                ORDER BY created DESC");
                        this.debug.Log("Method loadJobs :");
                        console.log(SQL);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbConfig_1.dbConnJob.query(SQL)];
                    case 2:
                        result = _a.sent();
                        // console.log(result[0]);
                        return [2 /*return*/, result[0]];
                    case 3:
                        err_10 = _a.sent();
                        console.log(err_10);
                        return [2 /*return*/, 0];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Job;
}());
exports.Job = Job;
// const job = new Job().createJob('0004','n','test','3100601766923',3000,'ทดสอบ','rangsan.wc@gmail.com','2023-04-29','2023-04-29','0004');
