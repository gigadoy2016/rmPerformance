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
exports.Employee = void 0;
var dbConfig_1 = require("../config/dbConfig");
var Debug_1 = require("./Debug");
var Employee = /** @class */ (function () {
    function Employee() {
        this.debug = new Debug_1.Debug(true, "Class Employee.ts");
    }
    Employee.prototype.getEmployeeByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, data, approver, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log("Class Employee:");
                        this.debug.Log("getEmployeeByID:" + id);
                        SQL = "SELECT * FROM employees WHERE ic_code ='" + id + "';";
                        console.log(SQL);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, dbConfig_1.dbConnection.query(SQL)];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, this.getApprover(id)];
                    case 3:
                        approver = _a.sent();
                        // console.log(approver[0]);
                        if (approver.length > 0) {
                            data[0][0].approver = approver;
                        }
                        // console.log(data[0][0]);
                        return [2 /*return*/, data[0]];
                    case 4:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Employee.prototype.getEmployee = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("getEmployee:");
                        SQL = "SELECT * FROM employees WHERE ic_code ='" + id + "';";
                        console.log(SQL);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbConfig_1.dbConnection.query(SQL)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data[0]];
                    case 3:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Employee.prototype.getApprover = function (ic_code) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, data, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug.Log("getApprover by " + ic_code + "");
                        SQL = "SELECT user_id , approver_id ,permission  FROM rm_approval WHERE enable =1 AND user_id='" + ic_code + "';";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbConfig_1.dbConnection.query(SQL)];
                    case 2:
                        data = _a.sent();
                        // console.log(data[0]);
                        return [2 /*return*/, data[0]];
                    case 3:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Employee;
}());
exports.Employee = Employee;
// const emp = new Employee();
// let user = emp.getEmployeeByID('0004').then(function(result){
//     console.log("result");
// });
// console.log(user);
