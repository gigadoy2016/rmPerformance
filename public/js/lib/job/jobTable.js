var JobTable = /** @class */ (function () {
    function JobTable(id, data) {
        this.tableId = "";
        this.MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.permission = 1;
        this.tableId = id;
        this.tableObj = document.getElementById(id);
        this.DATAs = data;
    }
    JobTable.prototype.removeRowAll = function () {
        console.log(">>>>>>>>> Table: remove rows All");
        var tbody = this.tableObj.getElementsByTagName('tbody')[0];
        var rows = tbody.getElementsByTagName('tr');
        while (rows.length > 0) {
            tbody.deleteRow(0);
        }
    };
    JobTable.prototype.setPermission = function (permission) {
        if (permission === undefined) {
            this.permission = 0;
        }
        else {
            this.permission = permission;
        }
    };
    JobTable.prototype.getContent = function () {
        this.removeRowAll();
        console.log(">>>>>>>>> Table: getContent");
        var tbody = this.tableObj.getElementsByTagName('tbody')[0];
        // newRow.innerHTML = "<td colspan='4'>No Data.</td><td>"+rows.length+"</td>";
        if (this.DATAs.length == 0) {
            var newRow = tbody.insertRow();
            newRow.innerHTML = "<td colspan='5'>No Data.</td><td></td>";
        }
        else {
            for (var i = 0; i < this.DATAs.length; i++) {
                var data = this.DATAs[i];
                var newRow = tbody.insertRow();
                var cell0 = newRow.insertCell(0);
                var cell1 = newRow.insertCell(1);
                var cell2 = newRow.insertCell(2);
                var cell3 = newRow.insertCell(3);
                var cell4 = newRow.insertCell(4);
                var param = data.ic + "|" + data.job_id;
                var encoded = btoa(param);
                var uri = "/job/read/" + encoded;
                cell0.innerHTML = i + 1 + ".";
                // cell1.innerHTML = "<a>"+data.customer_name+"</a><br /><small>CID:"+data.customer_id+"</small>";
                // console.log(">>>>>>>>> Table: getContent "+ this.permission);
                // console.log(data);
                if (this.permission <= 1) {
                    cell1.innerHTML = "<a>" + data.customer_name + "</a>";
                }
                else {
                    cell1.innerHTML = "<a>" + data.customer_name + " (ic:" + data.ic + ")</a>";
                }
                cell2.innerHTML = "<a href='" + uri + "' target='_blank'>" + data.text + " </a>";
                cell3.innerHTML = "<b>" + data.target.toLocaleString('en-US') + " ฿.</b><br /><small>" + this.formatDate(data.target_time) + " - " + this.formatDate(data.target_time2) + "</small>";
                cell3.style.textAlign = "right";
                cell4.innerHTML = '<button type="button" class="btn ' + this.getStatus(data.status) + ' btn-xs">' + data.status + '</button><br /><small>Created ' + this.formatDate(data.created) + '</small>';
                cell4.style.textAlign = "right";
            }
        }
    };
    JobTable.prototype.formatDate = function (txt) {
        var times = new Date(txt);
        var year = times.getFullYear();
        // const month:string = String("0" + (times.getMonth()+1)).slice(-2);
        var month = this.MONTH[times.getMonth()];
        var date = String("0" + times.getDate()).slice(-2);
        var HH = String("0" + times.getHours()).slice(-2);
        var mm = String("0" + times.getMinutes()).slice(-2);
        var ss = String("0" + times.getSeconds()).slice(-2);
        // let format = year+"-"+month+"-"+date+" "+HH+":"+mm+":"+ss;
        var format = date + "-" + month + "-" + year;
        return format;
    };
    JobTable.prototype.getStatus = function (status) {
        var result = "";
        if (status === "CREATE") {
            result = "btn-secondary";
        }
        else if (status === "SUCCESS") {
            result = "btn-success";
        }
        else if (status === "APPROVED") {
            result = "btn-primary";
        }
        else if (status === "REJECTED") {
            result = "btn-danger";
        }
        return result;
    };
    return JobTable;
}());
