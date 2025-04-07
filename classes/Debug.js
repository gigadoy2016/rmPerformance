"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
// import moment from 'moment';
// import * as moment from "moment";
var Debug = /** @class */ (function () {
    function Debug(status, name) {
        this.name = "";
        if (status !== undefined)
            this.on = status;
        else
            this.on = false;
        this.name = name;
    }
    Debug.prototype.debugLog = function (message) {
        this.Log(message);
    };
    Debug.prototype.showTime = function () {
        var times = new Date();
        var year = times.getFullYear();
        var month = String("0" + (times.getMonth() + 1)).slice(-2);
        var date = String("0" + times.getDate()).slice(-2);
        var HH = String("0" + times.getHours()).slice(-2);
        var mm = String("0" + times.getMinutes()).slice(-2);
        var ss = String("0" + times.getSeconds()).slice(-2);
        var time = year + "-" + month + "-" + date + " " + HH + ":" + mm + ":" + ss;
        return time;
    };
    Debug.prototype.convertDate = function (txt) {
        var times = new Date(txt);
        var year = times.getFullYear();
        var month = String("0" + (times.getMonth() + 1)).slice(-2);
        var date = String("0" + times.getDate()).slice(-2);
        var HH = String("0" + times.getHours()).slice(-2);
        var mm = String("0" + times.getMinutes()).slice(-2);
        var ss = String("0" + times.getSeconds()).slice(-2);
        var time = year + "-" + month + "-" + date + " " + HH + ":" + mm + ":" + ss;
        return time;
    };
    Debug.prototype.Log = function (msg) {
        var time = this.showTime();
        // console.log(time);
        if (this.on) {
            console.log("[DEBUG (".concat(this.name, ")- ").concat(time, "] ").concat(msg));
        }
    };
    Debug.prototype.antiQuote = function (txt) {
        var text = "";
        text = txt.replace(/'/g, '&#39');
        text = text.replace(/"/g, '&#39');
        text = text.replace(/\\/g, '-');
        return text;
    };
    return Debug;
}());
exports.Debug = Debug;
// var test = new Debug(true,"test");
// console.log(test.antiQuote("teste'test\\0'test'es"));
// console.log("testte'stte'tst".replace(/'/g,"&#39"));
// console.log(test.convertDate("2023-11-14T07:37:29.000Z"));
