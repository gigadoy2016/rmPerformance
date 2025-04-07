var Validation = /** @class */ (function () {
    function Validation() {
    }
    Validation.prototype.validation = function () {
        var inputDateStart = document.getElementById('date-start');
        var inputMonthStart = document.getElementById('month-select');
        var inputYearStart = document.getElementById('txt-year');
        var inputDateEnd = document.getElementById('date-end');
        var inputMonthEnd = document.getElementById('month-select-end');
        var inputYearEnd = document.getElementById('txt-year-end');
        var inputDateStartv = inputDateStart.value;
        var inputMonthStartv = inputMonthStart.value;
        var inputYearStartv = inputYearStart.value;
        var inputDateEndv = inputDateEnd.value;
        var inputMonthEndv = inputMonthEnd.value;
        var inputYearEndv = inputYearEnd.value;
        var now = new Date();
        var month = now.getMonth();
        if (inputDateStartv == "") {
            inputDateStart.value = "1";
        }
        if (inputDateEndv == "") {
            var year = parseInt(inputYearStartv);
            var month_1 = parseInt(inputMonthStartv);
            inputDateEnd.value = inputDateEndv = this.getLastDateOfMonth(year, month_1).toString();
        }
        var startDate = inputYearStartv + '-' + inputMonthStartv + '-' + inputDateStartv;
        var endDate = inputYearEndv + '-' + inputMonthEndv + '-' + inputDateEndv;
        return [startDate, endDate];
    };
    Validation.prototype.getLastDateOfMonth = function (year, month) {
        // month จะนับจาก 0-11 (0 = มกราคม, 11 = ธันวาคม)
        var lastDay = new Date(year, month, 0);
        return lastDay.getDate();
    };
    return Validation;
}());
