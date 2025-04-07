/*=====================================
Class Table
======================================*/
var waitingTable = /** @class */ (function () {
    function waitingTable(table_id, datas) {
        this.table_id = "";
        this.jsonWaitting = [];
        this.dataSet = datas;
        this.table_id = table_id;
    }
    waitingTable.prototype.setData = function (datas) {
        this.dataSet = datas;
    };
    waitingTable.prototype.showTable = function () {
        console.log("showTable()");
        var table = document.getElementById(this.table_id);
        this.removeRows(this.table_id);
        // console.log(this.dataSet.length);
        this.jsonWaitting = [];
        if (this.dataSet.length > 0) {
            for (var i = 0; i < this.dataSet.length; i++) {
                var data = this.dataSet[i];
                var row = table.insertRow(table.rows.length);
                var cell0 = row.insertCell(0);
                cell0.innerHTML = i + 1;
                var cell1 = row.insertCell(1);
                cell1.innerHTML = data.fund_code;
                var cell2 = row.insertCell(2);
                var am = 0;
                if (data.amount != null) {
                    am = parseInt(data.amount.replace(/,/g, ""));
                }
                cell2.innerHTML = this.getCurrency(am);
                var cell3 = row.insertCell(3);
                cell3.innerHTML = data.transaction_type;
                var cell4 = row.insertCell(4);
                cell4.innerHTML = data.status;
                var j = { "fundcode": data.fund_code,
                    "amount": this.getCurrency(am),
                    "tranType": data.transaction_type,
                    "status": data.status
                };
                this.jsonWaitting.push(j);
            }
        }
    };
    waitingTable.prototype.removeRows = function (table_id) {
        // console.log("remove rows------------");
        var table = document.getElementById(table_id);
        // console.log(table);
        // console.log("rows:"+table.rows.length);
        if (table.rows.length > 1) {
            for (var i = table.rows.length; i > 1; i--) {
                table.deleteRow(1);
            }
        }
    };
    waitingTable.prototype.groupBy = function (array, key) {
        var datas = array.reduce(function (result, item) {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
        return datas;
    };
    waitingTable.prototype.antiNaN = function (value) {
        if (value === "NaN") {
            return "";
        }
        return "" + value;
    };
    waitingTable.prototype.getCurrency = function (val) {
        if (val !== 0) {
            // val = Math.floor(val);
            var currencyValue = new Intl.NumberFormat('th-TH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(val);
            return this.antiNaN(currencyValue);
        }
        else {
            return "";
        }
    };
    waitingTable.prototype.getWaittingTrans = function () {
        return this.jsonWaitting;
    };
    return waitingTable;
}());
