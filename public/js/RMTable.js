var RMTable = /** @class */ (function () {
    function RMTable(id) {
        this.DATAs = [];
        this.amcSharing = [];
        this.table_id = "";
        this.offsetFee = 10; // ค่าชดเชย 10บาท
        this.jsonArray = [];
        this.incentive = 1;
        this.table_id = id;
    }
    RMTable.prototype.setOffsetFee = function (offset) {
        this.offsetFee = offset;
    };
    RMTable.prototype.setTableID = function (id) {
        this.table_id = id;
    };
    RMTable.prototype.setDatas = function (datas) {
        this.DATAs = datas;
    };
    RMTable.prototype.setSharing = function (sharing) {
        this.amcSharing = sharing;
    };
    RMTable.prototype.setUserProfile = function (user) {
        this.userProfile = user;
    };
    RMTable.prototype.sort = function (datas, key) {
        return datas.sort(function (a, b) { return a[key] - b[key]; });
    };
    RMTable.prototype.groupBy = function (array, key) {
        var datas = array.reduce(function (result, item) {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
        return datas;
    };
    RMTable.prototype.getTotalFee = function (transactions) {
        var fundCode = this.groupBy(transactions, "fund_code");
        var fundKeys = Object.keys(fundCode).sort();
        var employee_id = "";
        var user = {
            'totalAmount': 0,
            'totalFee': 0,
            'fontEndFee': 0,
            'waitingAmount': 0
        };
        var _loop_1 = function (i) {
            var key = fundKeys[i];
            var datas = fundCode[key];
            var sharing = 0.7;
            var cAmountTotal = 0;
            var feeTotal = 0;
            var sumFeeSUB = 0;
            var sumFeeSWI = 0;
            var waitingAmount = 0;
            // console.log(datas);
            var filteredData = this_1.amcSharing.filter(function (item) { return item.fund_code === datas[0].fund_code; });
            for (var j = 0; j < datas.length; j++) {
                var data = datas[j];
                // console.log(">>"+data.ic);
                if (data.status === "ALLOTTED") {
                    employee_id = data.ic;
                    if (data.sharing !== null) {
                        sharing = data.sharing;
                    }
                    else {
                        sharing = 0.7;
                    }
                    if (filteredData.length > 0) {
                        sharing = filteredData[0].sharing;
                    }
                    sharing = this_1.getValidateFreelancer(data.ic, data.amc_code, data.transaction_date, sharing);
                    if (data.confirmed_amount !== null) {
                        var confirmed_amount = parseFloat(data.confirmed_amount.replace(/,/g, ''));
                        cAmountTotal += confirmed_amount;
                    }
                    if (data.fee !== null) {
                        var fee = parseFloat(data.fee.replace(/,/g, ''));
                        if (data.transaction_type == "SUB") {
                            sumFeeSUB += fee;
                        }
                        else if (data.transaction_type == "SWI") {
                            sumFeeSWI += fee;
                        }
                        // feeTotal += fee;
                        // user.totalFee += fee;
                    }
                }
                else if (data.status === "WAITING") {
                    if (data.amount !== null) {
                        waitingAmount += parseFloat(data.amount.replace(/,/g, ''));
                    }
                }
            }
            var netSUB = this_1.getNet(sumFeeSUB) * sharing;
            var netSWI = this_1.getNet(sumFeeSWI) * sharing;
            //================= เพิ่ม ตัวทดในการลดเพื่อ Error ===============================
            var fontEndFeeSUB = Math.floor(netSUB);
            var fontEndFeeSWI = Math.floor(netSWI);
            if (fontEndFeeSUB > this_1.offsetFee) {
                // fontEndFeeSUB = fontEndFeeSUB - this.offsetFee;
                fontEndFeeSUB = Math.floor((fontEndFeeSUB - this_1.offsetFee) * this_1.incentive);
            }
            else if (fontEndFeeSUB > 0 && fontEndFeeSUB <= this_1.offsetFee) {
                fontEndFeeSUB = 0;
            }
            if (fontEndFeeSWI > this_1.offsetFee) {
                // fontEndFeeSWI = fontEndFeeSWI - this.offsetFee;
                fontEndFeeSWI = Math.floor((fontEndFeeSWI - this_1.offsetFee) * this_1.incentive);
            }
            else if (fontEndFeeSWI > 0 && fontEndFeeSWI <= this_1.offsetFee) {
                fontEndFeeSWI = 0;
            }
            var fontEndFee = fontEndFeeSUB + fontEndFeeSWI;
            user.totalAmount += cAmountTotal;
            user.fontEndFee += fontEndFee;
            user.totalFee += feeTotal;
            user.waitingAmount += waitingAmount;
        };
        var this_1 = this;
        for (var i = 0; i < fundKeys.length; i++) {
            _loop_1(i);
        }
        return user;
    };
    RMTable.prototype.filterData = function (array, key, values) {
        return array.filter(function (item) { return values.includes(item[key]); });
    };
    RMTable.prototype.getNet = function (fee) {
        var wh = fee * 0.03;
        var net = fee - wh;
        return net;
    };
    RMTable.prototype.latestUpdatedData = function (data) {
        if (data.length > 0) {
            return data.reduce(function (acc, obj) {
                var currentDate = new Date(obj.updated);
                var latestDate = new Date(acc.updated);
                if (currentDate > latestDate) {
                    return obj;
                }
                return acc;
            });
        }
        else {
            return data;
        }
    };
    RMTable.prototype.getTarget = function (data) {
        return data.reduce(function (acc, obj) {
            var currentDate = new Date(obj.month_active);
            var latestDate = new Date(acc.month_active);
            if (currentDate > latestDate) {
                return obj;
            }
            return acc;
        });
    };
    RMTable.prototype.genListTable = function (datas) {
        var table = document.getElementById(this.table_id);
        var users = datas.users;
        this.incentives = datas.incentives;
        this.amcSharing = datas.amc;
        var AMC = datas.amc;
        this.jsonArray = [];
        for (var i = 0; i < users.length; i++) {
            var lastRow = table.rows.length;
            var user = users[i];
            // console.log(user);
            var trailingFee = this.latestUpdatedData(user.trailingFee);
            // console.log("trailingFee>>>");
            var row = table.insertRow(lastRow);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            // const cell5 = row.insertCell(5);
            cell0.innerHTML = "<lable> " + user.ic_code + "</lable>";
            cell1.innerHTML = "<lable>" + user.name_th + " " + user.lastname_th + "</lable>";
            var obj = this.getTotalFee(user.transactions);
            var total_fee = trailingFee.trailing_fee + obj.fontEndFee;
            // console.log(user.ic_code+":"+obj.waitingAmount);
            var target = void 0;
            if (user.target.length > 0)
                target = this.getTarget(user.target);
            else {
                target = { target: user.d_target };
            }
            var labelTotalFee = "";
            if (total_fee > 0)
                labelTotalFee = Math.floor(total_fee).toLocaleString('en-US');
            var performance_1 = obj.fontEndFee + trailingFee.trailing_fee - target.target;
            var labelPerformance = Math.floor(performance_1).toLocaleString('en-US');
            var labelFontEndFee = "";
            if (obj.fontEndFee > 0)
                labelFontEndFee = Math.floor(obj.fontEndFee).toLocaleString('en-US');
            var empIc = 'emp-' + user.ic_code;
            var labelTarget = 0;
            if (target.target != undefined) {
                var txt = target.target;
                labelTarget = parseInt(txt);
            }
            cell2.innerHTML = Math.floor(labelTarget).toLocaleString('en-US');
            cell2.style.textAlign = "right";
            cell3.innerHTML = labelTotalFee;
            cell3.style.textAlign = "right";
            // cell4.innerHTML = labelFontEndFee;
            cell4.innerHTML = this.setGagueBar(empIc);
            var labelAmount = "";
            if (obj.waitingAmount > 0) {
                labelAmount = Math.floor(obj.waitingAmount).toLocaleString('en-US');
            }
            // cell5.innerHTML = labelAmount;
            // cell5.style.textAlign = "right";
            var total = Math.floor(obj.fontEndFee + trailingFee.trailing_fee);
            this.gagueBar(empIc, Math.floor(total), labelTarget);
            // console.log(total +"<"+ labelTarget);
            if (total < labelTarget) {
                row.style.backgroundColor = "#FADBD8";
            }
            else {
                row.style.backgroundColor = "#E9F7EF";
            }
            var userObj = {
                ic: user.ic_code,
                name: user.name_th + " " + user.lastname_th,
                target: labelTarget,
                totalFee: total_fee,
                amountWaiting: obj.waitingAmount
            };
            this.jsonArray.push(userObj);
        }
    };
    RMTable.prototype.genRM_Performance = function (datas) {
        var _this = this;
        console.log("++++++++++++++genRM_Performance++++++++++++++++++++++++++++++++++");
        console.log(datas);
        this.jsonArray = [];
        var tableBody = document.querySelector("#rm-performance-table tbody");
        this.removeRows();
        if (datas.length > 0) {
            datas.forEach(function (rowData) {
                var empIc = 'emp-' + rowData.ic;
                var newRow = document.createElement("tr");
                var totalFee = rowData.rmTrailing + rowData.totalFrontEndFee;
                newRow.innerHTML = "\n                    <td>".concat(rowData.ic, "</td>\n                    <td>").concat(rowData.name, "</td>\n                    <td style='text-align:right'>").concat(_this.getCurrency(rowData.target), "</td>\n                    <td style='text-align:right'>").concat(_this.getCurrency(totalFee), "</td>\n                    <td>").concat(_this.setGagueBar(empIc), "</td>\n                ");
                if (tableBody) {
                    tableBody.appendChild(newRow);
                }
                else {
                    console.error("Table body not found");
                }
                var target = 0;
                if (rowData.target != 0) {
                    target = rowData.target;
                }
                else {
                    target = 100;
                    totalFee = 0;
                }
                _this.gagueBar(empIc, Math.floor(totalFee), target);
                var userObj = {
                    ic: rowData.ic,
                    name: rowData.name,
                    target: rowData.target,
                    totalFee: totalFee,
                    amountWaiting: rowData.waitingAmount
                    // amountWaiting:0
                };
                _this.jsonArray.push(userObj);
            });
        }
    };
    RMTable.prototype.setGagueBar = function (id) {
        var code = ' <div class="progress bg-warning" id="' + id + '-1">';
        code += '<div id="' + id + '-2" class="progress-bar bg-warning" role="progressbar" aria-label="Example with label" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>';
        code += '</div>';
        code += '<div class="digital col-12" id="' + id + '-3">';
        // code +='<label id="'+id+'-4">0</label><label>/</label><label id="'+id+'-5">100</labe>.';
        code += '<label id="' + id + '-6">0</label><label>.';
        code += '</div>';
        return code;
    };
    RMTable.prototype.gagueBar = function (id, val, target) {
        val = Math.abs(val);
        var idBG = id + '-' + 1;
        var idGague = id + '-' + 2;
        var idLabelPerformance = id + '-' + 4;
        var idLabelTarget = id + '-' + 5;
        var idPercent = id + '-' + 6;
        var percent = Math.floor(val / target * 100);
        var obj1 = document.getElementById(idBG);
        var obj2 = document.getElementById(idGague);
        // const labelPerformance:any = document.getElementById(idLabelPerformance);
        // const labelTarget:any = document.getElementById(idLabelTarget);
        var labelPercent = document.getElementById(idPercent);
        // labelPerformance.innerHTML = Math.floor(val).toLocaleString('en-US');
        // labelTarget.innerHTML = Math.floor(target).toLocaleString('en-US');
        labelPercent.innerHTML = percent + "%";
        if (val <= target) {
            obj2.innerHTML = percent + '%';
            obj2.style.width = percent + '%';
            obj1.classList.remove("bg-warning");
            obj1.classList.remove("progress-bar-striped");
            obj2.classList.add("bg-warning");
        }
        else {
            var over_val = val - target;
            var percentDisplay = over_val / target * 100;
            obj2.innerHTML = percent + '%';
            obj2.style.width = percentDisplay + '%';
            obj1.classList.add("bg-warning");
            obj1.classList.add("progress-bar-striped");
            obj2.classList.remove("bg-warning");
            obj2.classList.add("bg-success");
        }
    };
    RMTable.prototype.removeRows = function () {
        //console.log("remove rows------------");
        var table = document.getElementById(this.table_id);
        if (table.rows.length > 0) {
            for (var i = table.rows.length; i > 1; i--) {
                table.deleteRow(1);
            }
        }
    };
    RMTable.prototype.json4Excel = function () {
        // console.log(this.jsonArray);
        return this.jsonArray;
    };
    // public getValidateFreelancer(ic_code:string ,amcCode:string,transactionDate:string,sharing:number):number{
    //     const startDate = new Date('2024-01-31');
    //     let datePart = transactionDate.split(" ")[0];
    //     let parts = datePart.split("/");
    //     let date = `${parts[2]}-${parts[1]}-${parts[0]}`;
    //     const transaction_date = new Date(date);
    //     if(ic_code.indexOf('F') === 0){            
    //         if(transaction_date > startDate){
    //             this.incentive = 0.75;                
    //             this.offsetFee = 0;                                             // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM Freelancer
    //             if(amcCode ==='ASSETFUND' || amcCode ==='KTAM'){
    //                 if(sharing === undefined || sharing === 0.7){
    //                     sharing = 1;
    //                 }
    //             }
    //         }
    //     }else{
    //         this.incentive = 1;
    //         this.offsetFee = 10;                                                // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM ทั่วไป
    //     }
    //     return sharing;
    // }
    // === Validate ค่า sharing * สำหรับบุคคลที่เป็น Freelancer =====================            
    // ASSETFUND , KTAM  and transaction date > 2024-02-01
    RMTable.prototype.getValidateFreelancer = function (ic_code, amcCode, transactionDate, sharing) {
        var incentives = this.incentives.filter(function (item) { return item.ic_code === ic_code; });
        var startDate = new Date('2024-01-31');
        var datePart = transactionDate.split(" ")[0];
        var parts = datePart.split("/");
        var date = "".concat(parts[2], "-").concat(parts[1], "-").concat(parts[0]);
        var transaction_date = new Date(date);
        if (ic_code.indexOf('F') === 0) {
            if (transaction_date > startDate) {
                if (incentives.length > 0) {
                    this.incentive = incentives[0].incentive;
                }
                else {
                    this.incentive = 0.75;
                }
                this.offsetFee = 0; // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM Freelancer
                if (amcCode === 'ASSETFUND' || amcCode === 'KTAM') {
                    if (sharing === undefined || sharing === 0.7) {
                        sharing = 1;
                    }
                }
            }
        }
        else {
            this.incentive = 1;
            this.offsetFee = 10; // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM ทั่วไป
        }
        return sharing;
    };
    RMTable.prototype.getCurrency = function (val) {
        if (val !== 0) {
            val = Math.floor(val);
            var currencyValue = new Intl.NumberFormat('th-TH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(val);
            return this.antiNaN(currencyValue);
        }
        else {
            return "0";
        }
    };
    RMTable.prototype.antiNaN = function (value) {
        if (value === "NaN") {
            return "";
        }
        return "" + value;
    };
    return RMTable;
}());
