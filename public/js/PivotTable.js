var PivotTable = /** @class */ (function () {
    function PivotTable(id) {
        this.datas = [];
        this.table_id = "";
        this.frontEndFee = 0;
        this.backEndFee = 0;
        this.grandTotalSumFrontEndFee = 0;
        this.offsetFee = 0; // ค่าชดเชย 10บาท
        this.amcSharing = [];
        this.jsonAllottment = [];
        this.jsonWaitting = [];
        this.jsonOther = [];
        this.permission = 0;
        this.incentive = 1;
        this.summaryFeeAll = 0;
        this.team = [];
        this.backEndSharing = [
            { AMC: "KTAM", sharing: 100 },
            { AMC: "EASTSPRING", sharing: 100 },
            { AMC: "KASSET", sharing: 100 },
            { AMC: "ASSETFUND", sharing: 100 },
            { AMC: "PRINCIPAL", sharing: 70 },
            { AMC: "MFC", sharing: 70 },
            { AMC: "SCBAM", sharing: 70 },
            { AMC: "ONEAM", sharing: 70 },
            { AMC: "UOBAM", sharing: 70 },
            { AMC: "LHFUND", sharing: 70 },
            { AMC: "KSAM", sharing: 70 },
            { AMC: "KKPAM", sharing: 80 },
            { AMC: "ABERDEEN", sharing: 80 }
        ];
        this.table_id = id;
    }
    PivotTable.prototype.setTeam = function (team) {
        this.team = team;
    };
    PivotTable.prototype.setPermission = function (permission) {
        this.permission = permission;
    };
    PivotTable.prototype.setData = function (datas) {
        this.datas = datas;
    };
    PivotTable.prototype.setTable = function (id) {
        this.table_id = id;
    };
    PivotTable.prototype.setAMCSharing = function (ar) {
        this.amcSharing = ar;
    };
    PivotTable.prototype.setUserProfile = function (user) {
        this.userProfile = user;
        if (user.ic_code.indexOf('F') === 0) {
            this.userProfile.type = 'F';
        }
        else {
            this.userProfile.type = 'P';
        }
    };
    PivotTable.prototype.groupBy = function (array, key) {
        var datas = array.reduce(function (result, item) {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
        return datas;
    };
    PivotTable.prototype.filterData = function (array, key, values) {
        return array.filter(function (item) { return values.includes(item[key]); });
    };
    PivotTable.prototype.getFundCodes = function (array, key) {
        return Array.from(new Set(array.map(function (item) { return item[key]; }))).sort();
    };
    PivotTable.prototype.setBackEndSharing = function () {
    };
    PivotTable.prototype.genFundTable = function (datas) {
        // console.log("==================FunCode Table=========================");
        var json = this.groupBy(datas, "fund_code");
        // let fundKeys:string[] = Object.keys(json).sort((a:string, b:string) => {
        //     return b.localeCompare(a);
        //   });
        var fundKeys = Object.keys(json).sort();
        // console.log("this.table_id:"+this.table_id);
        var table = document.getElementById(this.table_id);
        // console.log(json);
        var sumAmountSWI = 0;
        var sumAmountSUB = 0;
        var sumFeeSWI = 0;
        var sumFeeSUB = 0;
        var sumWH_SUB = 0;
        var sumWH_SWI = 0;
        var grandAmount = 0;
        var grandFee = 0;
        var grandFontEndFeeSUB = 0;
        var grandFontEndFeeSWI = 0;
        var grandBackEndFee = 0;
        var _loop_1 = function (r) {
            var key = fundKeys[r];
            var data = json[key];
            var tranSUB = this_1.filterData(data, "transaction_type", "SUB");
            var tranSWI = this_1.filterData(data, "transaction_type", "SWI");
            var sellingFee = this_1.getPercentage(data[0].sharing);
            var totalAmountSUB = tranSUB.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.amount.replace(/,/g, '')); }, 0);
            // totalAmountSUB = Math.floor(totalAmountSUB);
            sumAmountSUB += totalAmountSUB;
            var totalAmountSWI = tranSWI.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.amount.replace(/,/g, '')); }, 0);
            // totalAmountSWI = Math.floor(totalAmountSWI);
            sumAmountSWI += totalAmountSWI;
            var totalFeeSUB = tranSUB.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.fee.replace(/,/g, '')); }, 0);
            // totalFeeSUB = Math.floor(totalFeeSUB);
            sumFeeSUB += totalFeeSUB;
            var totalFeeSWI = tranSWI.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.fee.replace(/,/g, '')); }, 0);
            // totalFeeSWI = Math.floor(totalFeeSWI);
            sumFeeSWI += totalFeeSWI;
            var totalSumAmount = totalAmountSUB + totalAmountSWI;
            grandAmount += totalSumAmount;
            var totalSumFee = totalFeeSUB + totalFeeSWI;
            grandFee += totalSumFee;
            var whSUB = totalFeeSUB * 0.03;
            sumWH_SUB += whSUB;
            var whSWI = totalFeeSWI * 0.03;
            sumWH_SWI += whSWI;
            var netSUB = this_1.netCalculate(totalFeeSUB, whSUB);
            var netSWI = this_1.netCalculate(totalFeeSWI, whSWI);
            var fontEndFeeSUB = netSUB * data[0].sharing;
            var fontEndFeeSWI = netSWI * data[0].sharing;
            grandFontEndFeeSUB += fontEndFeeSUB;
            grandFontEndFeeSWI += fontEndFeeSWI;
            var sharingAMC = this_1.backEndSharing.find(function (item) { return item.AMC === key; });
            grandBackEndFee += (netSUB + netSWI) * sharingAMC;
            var row_1 = table.insertRow(table.rows.length);
            var cell0_1 = row_1.insertCell(0);
            var cell1_1 = row_1.insertCell(1);
            var cell2_1 = row_1.insertCell(2);
            var cell3_1 = row_1.insertCell(3);
            var cell4_1 = row_1.insertCell(4);
            var cell5_1 = row_1.insertCell(5);
            var cell6_1 = row_1.insertCell(6);
            var cell7_1 = row_1.insertCell(7);
            var cell8_1 = row_1.insertCell(8);
            var cell9_1 = row_1.insertCell(9);
            var cell10_1 = row_1.insertCell(10);
            var cell11_1 = row_1.insertCell(11);
            var cell12_1 = row_1.insertCell(12);
            var cell13_1 = row_1.insertCell(13);
            var cell14_1 = row_1.insertCell(14);
            cell0_1.innerHTML = "<lable>" + key + "</lable>";
            cell1_1.style.textAlign = "left";
            cell1_1.innerHTML = this_1.getCurrency(totalAmountSUB);
            cell1_1.style.textAlign = "right";
            cell2_1.innerHTML = this_1.getCurrency(totalFeeSUB);
            cell2_1.style.textAlign = "right";
            //======= SUB WH =============
            cell3_1.innerHTML = this_1.getCurrency(whSUB);
            cell3_1.style.textAlign = "right";
            //======= SUB Net ============
            cell4_1.innerHTML = this_1.getCurrency(netSUB);
            cell4_1.style.textAlign = "right";
            cell5_1.innerHTML = sellingFee;
            cell5_1.style.textAlign = "right";
            cell6_1.innerHTML = this_1.getCurrency(fontEndFeeSUB);
            cell6_1.style.textAlign = "right";
            cell7_1.innerHTML = this_1.getCurrency(totalAmountSWI);
            cell7_1.style.textAlign = "right";
            cell8_1.innerHTML = this_1.getCurrency(totalFeeSWI);
            cell8_1.style.textAlign = "right";
            //+++++++++++++++++++++++++++++++++++++++++++++++++++ SWI +++++++++++++
            //======= SUB WH =============
            cell9_1.innerHTML = this_1.getCurrency(whSWI);
            cell9_1.style.textAlign = "right";
            //======= SUB Net ============
            cell10_1.innerHTML = this_1.getCurrency(netSWI);
            cell10_1.style.textAlign = "right";
            cell11_1.innerHTML = sellingFee;
            cell11_1.style.textAlign = "right";
            cell12_1.innerHTML = this_1.getCurrency(fontEndFeeSWI);
            cell12_1.style.textAlign = "right";
            //==== Total Sum of Amount
            cell13_1.innerHTML = this_1.getCurrency(totalSumAmount);
            cell13_1.style.textAlign = "right";
            //==== Total Sum of Fee
            cell14_1.innerHTML = this_1.getCurrency(totalSumFee);
            cell14_1.style.textAlign = "right";
        };
        var this_1 = this;
        for (var r = 0; r < fundKeys.length; r++) {
            _loop_1(r);
        }
        var grandNetSUB = this.netCalculate(sumFeeSUB, sumWH_SUB);
        var grandNetSWI = this.netCalculate(sumFeeSWI, sumWH_SWI);
        var footer = table.createTFoot();
        var row = footer.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);
        var cell7 = row.insertCell(7);
        var cell8 = row.insertCell(8);
        var cell9 = row.insertCell(9);
        var cell10 = row.insertCell(10);
        var cell11 = row.insertCell(11);
        var cell12 = row.insertCell(12);
        var cell13 = row.insertCell(13);
        var cell14 = row.insertCell(14);
        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SUB2 +++++++++++++
        cell1.innerHTML = "<b>" + this.getCurrency(sumAmountSUB) + "</b>";
        cell1.style.textAlign = "right";
        cell2.innerHTML = "<b>" + this.getCurrency(sumFeeSUB) + "</b>";
        cell2.style.textAlign = "right";
        //======= SUB WH =============
        cell3.innerHTML = "<b>" + this.getCurrency(sumWH_SUB) + "</b>";
        cell3.style.textAlign = "right";
        //======= SUB Net ============
        cell4.innerHTML = "<b>" + this.getCurrency(grandNetSUB) + "</b>";
        cell4.style.textAlign = "right";
        //==============  Selling fee ==========
        cell5.innerHTML = ""; //this.getPercentage(data.selling_fee);
        cell5.style.textAlign = "right";
        //==============  Front End fee ==========
        cell6.innerHTML = "<b>" + this.getCurrency(grandFontEndFeeSUB) + "</b>";
        cell6.style.textAlign = "right";
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SWI +++++++++++++
        cell7.innerHTML = "<b>" + this.getCurrency(sumAmountSWI) + "</b>";
        cell7.style.textAlign = "right";
        cell8.innerHTML = "<b>" + this.getCurrency(sumFeeSWI) + "</b>";
        cell8.style.textAlign = "right";
        //======= SWI WH =============
        cell9.innerHTML = "<b>" + this.getCurrency(sumWH_SWI) + "</b>";
        cell9.style.textAlign = "right";
        //======= SWI Net ============
        cell10.innerHTML = "<b>" + this.getCurrency(grandNetSWI) + "</b>";
        cell10.style.textAlign = "right";
        //==============  Selling fee ==========
        cell11.innerHTML = "";
        cell11.style.textAlign = "right";
        //==============  Front End fee ==========
        cell12.innerHTML = "<b>" + this.getCurrency(grandFontEndFeeSWI) + "</b>";
        cell12.style.textAlign = "right";
        //==== Total Sum of Amount
        cell13.innerHTML = "<b>" + this.getCurrency(grandAmount) + "</b>";
        cell13.style.textAlign = "right";
        //==== Total Sum of Fee
        cell14.innerHTML = "<b>" + this.getCurrency(grandFee) + "</b>";
        cell14.style.textAlign = "right";
        this.frontEndFee = grandFontEndFeeSWI + grandFontEndFeeSUB;
        this.backEndFee = grandBackEndFee;
    };
    PivotTable.prototype.genFundTableVer2 = function (datas) {
        // console.log("==================FunCode Table=========================");
        var json = this.groupBy(datas, "fund_code");
        var amc_code = '';
        var fundKeys = Object.keys(json).sort();
        var table = document.getElementById(this.table_id);
        var sumAmountSWI = 0;
        var sumAmountSUB = 0;
        var sumFeeSWI = 0;
        var sumFeeSUB = 0;
        var sumWH_SUB = 0;
        var sumWH_SWI = 0;
        var grandAmount = 0;
        var grandFee = 0;
        var grandFontEndFeeSUB = 0;
        var grandFontEndFeeSWI = 0;
        var grandBackEndFee = 0;
        var grandTotalFontEndFee = 0;
        this.jsonAllottment = [];
        var _loop_2 = function (r) {
            var key = fundKeys[r];
            var data = json[key];
            amc_code = data[0].amc_code;
            var tranSUB = this_2.filterData(data, "transaction_type", "SUB");
            var tranSWI = this_2.filterData(data, "transaction_type", "SWI");
            // let sellingFee:string = this.getPercentage(data[0].sharing);
            var totalAmountSUB = tranSUB.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.confirmed_amount.replace(/,/g, '')); }, 0);
            sumAmountSUB += totalAmountSUB;
            var totalAmountSWI = tranSWI.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.confirmed_amount.replace(/,/g, '')); }, 0);
            sumAmountSWI += totalAmountSWI;
            var totalFeeSUB = tranSUB.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.fee.replace(/,/g, '')); }, 0);
            sumFeeSUB += totalFeeSUB;
            var totalFeeSWI = tranSWI.reduce(function (accumulator, currentItem) { return accumulator + parseFloat(currentItem.fee.replace(/,/g, '')); }, 0);
            sumFeeSWI += totalFeeSWI;
            var totalSumAmount = totalAmountSUB + totalAmountSWI;
            grandAmount += totalSumAmount;
            var totalSumFee = totalFeeSUB + totalFeeSWI;
            grandFee += totalSumFee;
            var whSUB = totalFeeSUB * 0.03;
            sumWH_SUB += whSUB;
            var whSWI = totalFeeSWI * 0.03;
            sumWH_SWI += whSWI;
            var netSUB = this_2.netCalculate(totalFeeSUB, whSUB);
            var netSWI = this_2.netCalculate(totalFeeSWI, whSWI);
            this_2.summaryFeeAll = sumFeeSUB + sumFeeSWI;
            var sharingAMC = this_2.backEndSharing.find(function (item) { return item.AMC === amc_code; });
            if (sharingAMC === undefined) {
                sharingAMC = 100;
            }
            grandBackEndFee += (netSUB + netSWI) * sharingAMC.sharing / 100;
            // console.log(this.summaryFeeAll);
            // === Validate ค่า sharing =================================================            
            var sharing = data[0].sharing;
            if (sharing == null) {
                // sharing = 1;
                sharing = 0.7;
            }
            var filteredData = this_2.amcSharing.filter(function (item) { return item.fund_code === data[0].fund_code; });
            if (filteredData.length > 0) {
                var s = filteredData[0];
                if (data.length > 0) {
                    var amc_date = new Date(s.promotion_start_date);
                    // let dateString  = new Date(data[0].transaction_date);
                    var datePart = data[0].transaction_date.split(" ")[0]; // เอาเฉพาะส่วนของวันที่ (27/03/04)
                    var _a = datePart.split("/"), day = _a[0], month = _a[1], year = _a[2];
                    var transaction_date = new Date("".concat(year, "-").concat(month, "-").concat(day));
                    if (amc_date <= transaction_date) {
                        if (s.sharing !== undefined)
                            sharing = parseFloat(s.sharing);
                    }
                }
            }
            // === Validate ค่า sharing * สำหรับบุคคลที่เป็น Freelancer =====================            
            // ASSETFUND , KTAM  and transaction date > 2024-02-01
            if (data.length > 0) {
                sharing = this_2.getValidateFreelancer(data[0].ic, data[0].amc_code, data[0].transaction_date, sharing);
            }
            else if (filteredData.length > 0) {
                sharing = this_2.getValidateFreelancer(filteredData[0].ic, filteredData[0].amc_code, filteredData[0].transaction_date, sharing);
            }
            //================= เพิ่ม ตัวทดในการลดเพื่อ Error ===============================
            var fontEndFeeSUB = Math.floor(netSUB * sharing);
            if (fontEndFeeSUB > 10) {
                // fontEndFeeSUB = fontEndFeeSUB - this.offsetFee;
                fontEndFeeSUB = Math.floor((fontEndFeeSUB - this_2.offsetFee) * this_2.incentive);
            }
            else if (fontEndFeeSUB > 0 && fontEndFeeSUB <= 10) {
                fontEndFeeSUB = 0;
            }
            var fontEndFeeSWI = Math.floor(netSWI * sharing);
            if (fontEndFeeSWI > 10) {
                // fontEndFeeSWI = fontEndFeeSWI - this.offsetFee;
                fontEndFeeSWI = Math.floor((fontEndFeeSWI - this_2.offsetFee) * this_2.incentive);
            }
            else if (fontEndFeeSWI > 0 && fontEndFeeSWI <= 10) {
                fontEndFeeSWI = 0;
            }
            var totalFontEndFee = fontEndFeeSUB + fontEndFeeSWI;
            grandFontEndFeeSUB += fontEndFeeSUB;
            grandFontEndFeeSWI += fontEndFeeSWI;
            grandTotalFontEndFee += totalFontEndFee;
            var row_2 = table.insertRow(table.rows.length);
            var cell0_2 = row_2.insertCell(0);
            var cell1_2 = row_2.insertCell(1);
            var cell6_2 = row_2.insertCell(2);
            var cell7_2 = row_2.insertCell(3);
            var cell12_2 = row_2.insertCell(4);
            var cell13_2 = row_2.insertCell(5);
            var cell14_2 = row_2.insertCell(6);
            cell0_2.innerHTML = "<lable>" + key + "</lable>";
            var j = { "fundcode": key };
            cell1_2.style.textAlign = "left";
            cell1_2.innerHTML = this_2.getCurrency(totalAmountSUB);
            cell1_2.style.textAlign = "right";
            if (this_2.permission !== undefined) {
                if (this_2.permission === 3 || this_2.permission === 5) {
                    var text = '';
                    // if(this.userProfile.type ==='P'){
                    text += 'sharing = ' + (sharing * 100) + '%';
                    // }
                    if (this_2.incentive == 0.75) {
                        text += '  incentive= 75%';
                    }
                    else if (this_2.incentive > 0) {
                        text += '  incentive= ' + (this_2.incentive * 100) + '%';
                    }
                    cell6_2.innerHTML = "<a title='" + text + "' href='#'>" + this_2.getCurrency(fontEndFeeSUB) + "</a>";
                }
            }
            else {
                cell6_2.innerHTML = this_2.getCurrency(fontEndFeeSUB);
            }
            cell6_2.style.textAlign = "right";
            cell7_2.innerHTML = this_2.getCurrency(totalAmountSWI);
            cell7_2.style.textAlign = "right";
            if (this_2.permission !== undefined) {
                if (this_2.permission === 3 || this_2.permission === 5) {
                    var text = '';
                    // if(this.userProfile.type ==='P'){
                    text += 'sharing = ' + (sharing * 100) + '%';
                    // }
                    if (this_2.incentive == 0.75) {
                        text += '  incentive= 75%';
                    }
                    else if (this_2.incentive > 0) {
                        text += '  incentive= ' + (this_2.incentive * 100) + '%';
                    }
                    cell12_2.innerHTML = "<a title='" + text + "' href='#'>" + this_2.getCurrency(fontEndFeeSWI) + "</a>";
                }
            }
            else {
                cell12_2.innerHTML = this_2.getCurrency(fontEndFeeSWI);
            }
            cell12_2.style.textAlign = "right";
            if (totalAmountSUB > 0) {
                j.SUB = { "amount": this_2.getCurrency(totalAmountSUB), "FEFee": this_2.getCurrency(fontEndFeeSUB) };
            }
            if (totalAmountSWI > 0) {
                j.SWI = { "amount": this_2.getCurrency(totalAmountSWI), "FEFee": this_2.getCurrency(fontEndFeeSWI) };
            }
            //==== Total Sum of Amount
            cell13_2.innerHTML = this_2.getCurrency(totalSumAmount);
            cell13_2.style.textAlign = "right";
            //==== Total Sum of Fee
            cell14_2.innerHTML = this_2.getCurrency(totalFontEndFee);
            cell14_2.style.textAlign = "right";
            j.total_amount = this_2.getCurrency(totalSumAmount);
            j.total_FEFee = this_2.getCurrency(totalFontEndFee);
            this_2.jsonAllottment.push(j);
        };
        var this_2 = this;
        for (var r = 0; r < fundKeys.length; r++) {
            _loop_2(r);
        }
        var grandNetSUB = this.netCalculate(sumFeeSUB, sumWH_SUB);
        var grandNetSWI = this.netCalculate(sumFeeSWI, sumWH_SWI);
        var footer = table.createTFoot();
        var row = footer.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell6 = row.insertCell(2);
        var cell7 = row.insertCell(3);
        var cell12 = row.insertCell(4);
        var cell13 = row.insertCell(5);
        var cell14 = row.insertCell(6);
        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SUB +++++++++++++
        var sumAmountSUB_s = this.getCurrency(sumAmountSUB);
        cell1.innerHTML = "<b>" + sumAmountSUB_s + "</b>";
        cell1.style.textAlign = "right";
        //==============  Front End fee SUB==========
        var sumFEFeeSUB_s = this.getCurrency(grandFontEndFeeSUB);
        cell6.innerHTML = "<b>" + sumFEFeeSUB_s + "</b>";
        cell6.style.textAlign = "right";
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SWI +++++++++++++
        var sumAmountSWI_s = this.getCurrency(sumAmountSWI);
        cell7.innerHTML = "<b>" + sumAmountSWI_s + "</b>";
        cell7.style.textAlign = "right";
        //==============  Front End fee SWI==========
        var sumFEFeeSWI_s = this.getCurrency(grandFontEndFeeSWI);
        cell12.innerHTML = "<b>" + sumFEFeeSWI_s + "</b>";
        cell12.style.textAlign = "right";
        //==== Total Sum of Amount
        var sumAmount_s = this.getCurrency(grandAmount);
        cell13.innerHTML = "<b>" + sumAmount_s + "</b>";
        cell13.style.textAlign = "right";
        //==== Total Sum of Fee
        var sumFEFee_s = this.getCurrency(grandTotalFontEndFee);
        cell14.innerHTML = "<b>" + sumFEFee_s + "</b>";
        cell14.style.textAlign = "right";
        this.frontEndFee = grandFontEndFeeSWI + grandFontEndFeeSUB;
        this.grandTotalSumFrontEndFee = grandFontEndFeeSWI + grandFontEndFeeSUB;
        this.backEndFee = grandBackEndFee;
        this.jsonSum = {
            "sumAmountSUB": sumAmountSUB_s,
            "sumFEFeeSUB": sumFEFeeSUB_s,
            "sumAmountSWI": sumAmountSWI_s,
            "sumFEFeeSWI": sumFEFeeSWI_s,
            "sumAmount": sumAmount_s,
            "sumFEFee": sumFEFee_s,
            "sumaryFEE_All": this.summaryFeeAll,
            "grandBackEndFee": grandBackEndFee
        };
    };
    PivotTable.prototype.getCurrency = function (val) {
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
    PivotTable.prototype.antiNaN = function (value) {
        if (value === "NaN") {
            return "";
        }
        return "" + value;
    };
    PivotTable.prototype.removeRows = function () {
        //console.log("remove rows------------");
        var table = document.getElementById(this.table_id);
        if (table.rows.length > 2) {
            for (var i = table.rows.length; i > 2; i--) {
                table.deleteRow(2);
            }
        }
    };
    PivotTable.prototype.netCalculate = function (fee, wh) {
        var net = fee - wh;
        return net;
    };
    PivotTable.prototype.getPercentage = function (data) {
        if (data === null) {
            return "0 %";
        }
        return (data * 100) + " %";
    };
    PivotTable.prototype.getFrontEndFee = function () {
        // console.log("--------------------------------------------------------");
        // console.log(this.frontEndFee);
        return this.frontEndFee;
    };
    PivotTable.prototype.getgrandTotalSumFrontEndFee = function () {
        return this.grandTotalSumFrontEndFee;
    };
    PivotTable.prototype.getAllottment = function () {
        return this.jsonAllottment;
    };
    PivotTable.prototype.getSum = function () {
        return this.jsonSum;
    };
    PivotTable.prototype.getSumaryAllFee = function () {
        return this.summaryFeeAll;
    };
    PivotTable.prototype.getSumaryAllFeeStr = function () {
        return this.getCurrency(this.summaryFeeAll);
    };
    PivotTable.prototype.getBackEndFee = function () {
        return this.backEndFee;
    };
    PivotTable.prototype.getBackEndFeeStr = function () {
        return this.getCurrency(this.backEndFee);
    };
    PivotTable.prototype.test = function () {
        console.log("==================FunCode Table=========================");
    };
    // === Validate ค่า sharing * สำหรับบุคคลที่เป็น Freelancer =====================            
    // ASSETFUND , KTAM  and transaction date > 2024-02-01
    PivotTable.prototype.getValidateFreelancer = function (ic_code, amcCode, transactionDate, sharing) {
        var startDate = new Date('2024-01-31');
        var datePart = transactionDate.split(" ")[0];
        var parts = datePart.split("/");
        var date = "".concat(parts[2], "-").concat(parts[1], "-").concat(parts[0]);
        var transaction_date = new Date(date);
        if (ic_code.indexOf('F') === 0) {
            if (transaction_date > startDate) {
                if (this.userProfile) {
                    if (this.userProfile.incentive !== undefined || this.userProfile.incentive !== null) {
                        var ins = this.userProfile.incentive;
                        if (this.userProfile.incentive !== undefined) {
                            this.incentive = ins[0].incentive;
                        }
                        else {
                            this.incentive = 0.75;
                        }
                    }
                    else {
                        this.incentive = 0.75;
                    }
                }
                else {
                    this.incentive = 0.75;
                }
                this.offsetFee = 0; // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM Freelancer
                /** จากการประชุมวันที่ 30/09/2024 ยกเลิกการคำนวน sharing สำหรับ Freelancer */
                // if(amcCode ==='ASSETFUND' || amcCode ==='KTAM' || amcCode ==='KASSET'){
                if (sharing === undefined || sharing === 0.7) {
                    sharing = 1;
                }
                // }
            }
        }
        else {
            this.incentive = 1;
            // this.offsetFee = 10;                                                // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM ทั่วไป
        }
        return sharing;
    };
    PivotTable.prototype.getTotalFee = function (array, key) {
        return Array.from(new Set(array.map(function (item) { return item[key]; }))).sort();
    };
    return PivotTable;
}());
