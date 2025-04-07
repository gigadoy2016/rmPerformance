var DateTime = /** @class */ (function () {
    function DateTime() {
    }
    DateTime.prototype.showTime = function () {
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
    DateTime.prototype.convertDate = function (txt) {
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
    DateTime.prototype.convertDate2 = function (txt) {
        var times = new Date(txt);
        var year = times.getFullYear();
        var month = String("0" + (times.getMonth() + 1)).slice(-2);
        var date = String("0" + times.getDate()).slice(-2);
        var HH = String("0" + times.getHours()).slice(-2);
        var mm = String("0" + times.getMinutes()).slice(-2);
        var ss = String("0" + times.getSeconds()).slice(-2);
        var time = year + "-" + month + "-" + date;
        return time;
    };
    return DateTime;
}());
