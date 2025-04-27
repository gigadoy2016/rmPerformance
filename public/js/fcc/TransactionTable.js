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
var TransactionTable = /** @class */ (function () {
    function TransactionTable(table_id, transactions) {
        this.permission = 0;
        this.sumSalary = 0;
        this.totalIncentive = 0;
        this.table_id = table_id;
        this.transactions = transactions;
        this.table = document.getElementById(table_id);
    }
    TransactionTable.prototype.setPermission = function (permission) {
        this.permission = permission;
    };
    TransactionTable.prototype.setDate = function (st, ed, ic_code) {
        this.startDate = st;
        this.endDate = ed;
        this.ic_code = ic_code;
    };
    TransactionTable.prototype.setUser = function (user) {
        this.user = user;
    };
    TransactionTable.prototype.setTeam = function (team) {
        this.team = team;
    };
    TransactionTable.prototype.setData = function (data) {
        this.DATAs = data;
    };
    TransactionTable.prototype.antiNaN = function (value) {
        if (value === "NaN") {
            return "";
        }
        return "" + value;
    };
    TransactionTable.prototype.getCurrency = function (val) {
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
    TransactionTable.prototype.sortedFundCode = function (obj) {
        return obj.sort(function (a, b) { return a.fundcode.localeCompare(b.fundcode); });
    };
    TransactionTable.prototype.removeRows = function () {
        var table = document.getElementById(this.table_id);
        if (table.rows.length > 2) {
            for (var i = table.rows.length; i > 2; i--) {
                table.deleteRow(2);
            }
        }
    };
    TransactionTable.prototype.renderTable = function (data, transactions) {
        console.log(">>> render TransactionTable.ts <<<<");
        this.DATAs = data;
        var fundCodes = data.fund_codes;
        console.log(transactions);
        if (transactions.length > 0) {
            fundCodes = this.sortedFundCode(fundCodes);
        }
        else {
            alert("No Transaactions");
        }
        this.removeRows();
        for (var i = 0; i < fundCodes.length; i++) {
            var fundCode = fundCodes[i];
            var row_1 = this.table.insertRow(this.table.rows.length);
            var cell0_1 = row_1.insertCell(0);
            var cell1_1 = row_1.insertCell(1);
            var cell6_1 = row_1.insertCell(2);
            var cell7 = row_1.insertCell(3);
            var cell12 = row_1.insertCell(4);
            var cell13 = row_1.insertCell(5);
            var cell14 = row_1.insertCell(6);
            cell0_1.innerHTML = "<lable>" + fundCode.fundcode + "</lable>";
            cell1_1.style.textAlign = "left";
            cell1_1.innerHTML = this.getCurrency(fundCode.subAmount);
            cell1_1.style.textAlign = "right";
            var text6 = 'SA Sharing = ' + (fundCode.saSharing * 100) + '%';
            var incentive = fundCode.incentive * 100;
            var rmSharing = fundCode.rmSharing * 100;
            text6 += ', RM = ' + rmSharing + '%';
            text6 = "Net Fee= " + this.getCurrency(fundCode.subNetFee) + ": " + text6;
            if (this.permission >= 3) {
                cell6_1.innerHTML = "<a title='" + text6 + "' href='#'>" + this.getCurrency(fundCode.subFrontEndFee) + "</a>";
            }
            else {
                cell6_1.innerHTML = this.getCurrency(fundCode.subFrontEndFee);
            }
            cell6_1.style.textAlign = "right";
            cell7.innerHTML = this.getCurrency(fundCode.swiAmount);
            cell7.style.textAlign = "right";
            var text12 = 'SA Sharing = ' + (fundCode.saSharing * 100) + '%';
            text12 += ', RM = ' + rmSharing + '%';
            text12 = "Net Fee= " + this.getCurrency(fundCode.swiNetFee) + ": " + text12;
            if (this.permission >= 3) {
                cell12.innerHTML = "<a title='" + text12 + "' href='#'>" + this.getCurrency(fundCode.swiFrontEndFee) + "</a>";
            }
            else {
                cell12.innerHTML = this.getCurrency(fundCode.swiFrontEndFee);
            }
            cell12.style.textAlign = "right";
            cell13.innerHTML = this.getCurrency(fundCode.totalAmount);
            cell13.style.textAlign = "right";
            cell14.innerHTML = this.getCurrency(fundCode.totalFrontEndFee);
            cell14.style.textAlign = "right";
        }
        var footer = this.table.createTFoot();
        var row = footer.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);
        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        var grandTotalSubAmount = this.getCurrency(data['1grandTotalSubAmount']);
        cell1.innerHTML = "<b>" + grandTotalSubAmount + "</b>";
        cell1.style.textAlign = "right";
        var grandTotalSubFrontEndFee = this.getCurrency(data['2grandTotalSubFontEndFee']);
        cell2.innerHTML = "<b>" + grandTotalSubFrontEndFee + "</b>";
        cell2.style.textAlign = "right";
        var grandTotalSwiAmount = this.getCurrency(data['3grandTotalSwiAmount']);
        cell3.innerHTML = "<b>" + grandTotalSwiAmount + "</b>";
        cell3.style.textAlign = "right";
        var grandTotalSwiFrontEndFee = this.getCurrency(data['4grandTotalSwiFontEndFee']);
        cell4.innerHTML = "<b>" + grandTotalSwiFrontEndFee + "</b>";
        cell4.style.textAlign = "right";
        var grandTotalAmount = this.getCurrency(data['5grandTotalAmount']);
        cell5.innerHTML = "<b>" + grandTotalAmount + "</b>";
        cell5.style.textAlign = "right";
        var grandTotalFrontEndFee = this.getCurrency(data['6grandTotalFrontEndFee']);
        cell6.innerHTML = "<b>" + grandTotalFrontEndFee + "</b>";
        cell6.style.textAlign = "right";
    };
    TransactionTable.prototype.renderTableTeam = function (data) {
        this.dataTeam = data;
        var fundCodes = data.fundCodeTeam;
        this.member = data.member;
        if (fundCodes.length > 0) {
            fundCodes = this.sortedFundCode(fundCodes);
        }
        this.removeRows();
        for (var i = 0; i < fundCodes.length; i++) {
            var fundCode = fundCodes[i];
            var row_2 = this.table.insertRow(this.table.rows.length);
            var cell0_2 = row_2.insertCell(0);
            var cell1_2 = row_2.insertCell(1);
            var cell6_2 = row_2.insertCell(2);
            var cell7 = row_2.insertCell(3);
            var cell12 = row_2.insertCell(4);
            var cell13 = row_2.insertCell(5);
            var cell14 = row_2.insertCell(6);
            cell0_2.innerHTML = "<lable>" + fundCode.fundcode + "</lable>";
            cell1_2.style.textAlign = "left";
            cell1_2.innerHTML = this.getCurrency(fundCode.subAmount);
            cell1_2.style.textAlign = "right";
            cell6_2.innerHTML = this.getCurrency(fundCode.subFrontEndFee);
            cell6_2.style.textAlign = "right";
            cell7.innerHTML = this.getCurrency(fundCode.swiAmount);
            cell7.style.textAlign = "right";
            cell12.innerHTML = this.getCurrency(fundCode.swiFrontEndFee);
            cell12.style.textAlign = "right";
            cell13.innerHTML = this.getCurrency(fundCode.totalAmount);
            cell13.style.textAlign = "right";
            cell14.innerHTML = this.getCurrency(fundCode.totalFrontEndFee);
            cell14.style.textAlign = "right";
        }
        var footer = this.table.createTFoot();
        var row = footer.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);
        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        var grandTotalSubAmount = this.getCurrency(data['1grandTotalSubAmount']);
        cell1.innerHTML = "<b>" + grandTotalSubAmount + "</b>";
        cell1.style.textAlign = "right";
        var grandTotalSubFrontEndFee = this.getCurrency(data['2grandTotalSubFontEndFee']);
        cell2.innerHTML = "<b>" + grandTotalSubFrontEndFee + "</b>";
        cell2.style.textAlign = "right";
        var grandTotalSwiAmount = this.getCurrency(data['3grandTotalSwiAmount']);
        cell3.innerHTML = "<b>" + grandTotalSwiAmount + "</b>";
        cell3.style.textAlign = "right";
        var grandTotalSwiFrontEndFee = this.getCurrency(data['4grandTotalSwiFontEndFee']);
        cell4.innerHTML = "<b>" + grandTotalSwiFrontEndFee + "</b>";
        cell4.style.textAlign = "right";
        var grandTotalAmount = this.getCurrency(data['5grandTotalAmount']);
        cell5.innerHTML = "<b>" + grandTotalAmount + "</b>";
        cell5.style.textAlign = "right";
        var grandTotalFrontEndFee = this.getCurrency(data['6grandTotalFrontEndFee']);
        cell6.innerHTML = "<b>" + grandTotalFrontEndFee + "</b>";
        cell6.style.textAlign = "right";
    };
    TransactionTable.prototype.rederBoxTeamPerf = function () {
        //=========================== Title =========================================
        var headerSheet = this.dataTeam.teamName + " [" + this.dataTeam.member + "]";
        var headerElement = document.getElementById('nameRM');
        if (headerElement) {
            headerElement.innerHTML = headerSheet;
        }
        // ======================== RM Box ==========================================
        var icLabelElement = document.getElementById('label_ic');
        var icCodeElement = document.getElementById('ic_code');
        var targetElement = document.getElementById('target');
        var fontEndFeeElement = document.getElementById('fontEndFee');
        var trailingElement = document.getElementById('trailing');
        var totalFeeElement = document.getElementById('total_fee');
        var performanceElement = document.getElementById('performance');
        if (icLabelElement) {
            icLabelElement.innerHTML = this.team.remark;
        }
        if (icCodeElement) {
            icCodeElement.innerHTML = '';
        }
        if (targetElement) {
            targetElement.innerHTML = this.getCurrency(this.dataTeam.target);
        }
        if (fontEndFeeElement) {
            var total = this.getCurrency(this.dataTeam['6grandTotalFrontEndFee']);
            fontEndFeeElement.innerHTML = total;
        }
        var trailingRM = this.dataTeam.rmTrailingFee;
        if (trailingElement) {
            trailingElement.innerHTML = this.getCurrency(trailingRM);
        }
        var totalFee = this.dataTeam['6grandTotalFrontEndFee'] + trailingRM;
        if (totalFeeElement) {
            totalFeeElement.innerHTML = this.getCurrency(totalFee);
        }
        if (performanceElement) {
            var target = parseFloat(this.dataTeam.target);
            var pef = totalFee - target;
            var className = 'per-red';
            if (pef > 0) {
                className = 'per-green';
            }
            var txt = '<label class="' + className + '">' + this.getCurrency(pef) + '</label>';
            performanceElement.innerHTML = txt;
        }
        //========================== RM Incentive ==================================
        var teamAUM_Element = document.getElementById('aum_val');
        var salaryElement = document.getElementById('salary');
        var salaryCaptionElement = document.getElementById('caption_salary');
        var incentiveSharingElement = document.getElementById('incentive');
        var rmPromotionElement = document.getElementById('promotion_val');
        var rmTotalIncentiveCaption = document.getElementById('caption_totalPay');
        var rmTotalIncentiveElement = document.getElementById('totalPay');
        if (teamAUM_Element) {
            teamAUM_Element.innerHTML = this.getCurrency(this.dataTeam.totalAUM);
        }
        if (salaryCaptionElement) {
            salaryCaptionElement.innerHTML = 'Team Salary:';
        }
        if (salaryElement) {
            salaryElement.innerHTML = this.getCurrency(this.dataTeam.salary);
        }
        if (incentiveSharingElement) {
            incentiveSharingElement.innerHTML = this.getCurrency(this.dataTeam.sumPaySharing);
        }
        if (rmPromotionElement) {
            rmPromotionElement.innerHTML = this.getCurrency(this.dataTeam.rmPromotion);
        }
        if (rmTotalIncentiveCaption) {
            rmTotalIncentiveCaption.innerHTML = 'Total:';
        }
        if (rmTotalIncentiveElement) {
            rmTotalIncentiveElement.innerHTML = this.getCurrency(this.dataTeam.totalIcentive);
        }
        //========================== WCC Revenue ==================================
        var wccFrontEndFeeElement = document.getElementById('caption_feeSummary');
        var wccTrailingFeeElement = document.getElementById('caption_wccTrailingFee');
        var wccPromotionFeeElement = document.getElementById('wcc_promotion_val');
        var wccTotalRevenueElement = document.getElementById('caption_WCCPerf');
        var netRevenueElement = document.getElementById('value_gp');
        var netSharingElement = document.getElementById('caption_gp');
        var wccFrontEndFee = this.dataTeam['7grandTotalWCCFrontEndFee'];
        var wccTrailingFee = this.dataTeam.wccTrailingFee;
        var wccPromotion = this.dataTeam.wccPromotion;
        var totalRevenue = wccFrontEndFee + wccTrailingFee + wccPromotion;
        var totalIncentive = this.dataTeam.totalIcentive;
        var netRevenue = totalRevenue - totalIncentive;
        var netSharing = netRevenue / totalRevenue * 100;
        if (wccFrontEndFeeElement) {
            wccFrontEndFeeElement.innerHTML = this.getCurrency(wccFrontEndFee);
        }
        if (wccTrailingFeeElement) {
            wccTrailingFeeElement.innerHTML = this.getCurrency(wccTrailingFee);
        }
        if (wccPromotionFeeElement) {
            wccPromotionFeeElement.innerHTML = this.getCurrency(wccPromotion);
        }
        if (wccTotalRevenueElement) {
            wccTotalRevenueElement.innerHTML = this.getCurrency(totalRevenue);
        }
        if (netRevenueElement) {
            netRevenueElement.innerHTML = this.getCurrency(netRevenue);
        }
        if (netSharingElement) {
            netSharingElement.innerHTML = this.getCurrency(netSharing) + "%";
        }
    };
    /**
     *
     *============ @param objUserTarget ==============================================================================================
     */
    TransactionTable.prototype.rederBoxUserPerf = function (objUserTarget) {
        console.log(">> rederBoxUserPerf : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        var targets = objUserTarget[0], salaries = objUserTarget[1], trailing = objUserTarget[2];
        // console.log(trailing);
        //=========================== Title =========================================
        var headerSheet = this.DATAs.profile.name_eng + " " + this.DATAs.profile.last_name_eng
            + " IC:" + this.DATAs.profile.ic_code;
        var headerElement = document.getElementById('nameRM');
        if (headerElement) {
            headerElement.innerHTML = headerSheet;
        }
        // ======================== RM Box ==========================================
        var sumTarget = 0;
        var targetDetail = '';
        if (targets.length > 0) {
            for (var i = 0; i < 1; i++) {
                var t = targets[i];
                sumTarget += parseInt(t.target);
                targetDetail += t.target + ",";
            }
        }
        var icCodeElement = document.getElementById('ic_code');
        if (icCodeElement) {
            icCodeElement.innerHTML = this.DATAs.profile.ic_code;
        }
        ;
        var targetElement = document.getElementById('target');
        if (targetElement) {
            if (targetDetail !== "")
                targetElement.innerHTML = "<a href=\"#\" title=\"[".concat(targetDetail, "]\">").concat(this.getCurrency(sumTarget), "</a>");
        }
        var fontEndFeeElement = document.getElementById('fontEndFee');
        if (fontEndFeeElement) {
            var total = this.getCurrency(this.user.frontEndFee);
            fontEndFeeElement.innerHTML = total;
        }
        var sumTrailingFee = this.getTrailingFee(trailing);
        var trailingDate = this.getTrailingDate(trailing);
        var trailingElement = document.getElementById('trailing');
        var trailingDateElement = document.getElementById('trailing-date');
        if (trailingElement) {
            trailingElement.innerHTML = this.getCurrency(sumTrailingFee);
        }
        if (trailingDateElement) {
            trailingDateElement.innerHTML = trailingDate;
        }
        var totalFeeElement = document.getElementById('total_fee');
        var totalFee = sumTrailingFee + this.user.frontEndFee;
        if (totalFeeElement) {
            totalFeeElement.innerHTML = this.getCurrency(totalFee);
        }
        var performanceElement = document.getElementById('performance');
        var pef = totalFee - sumTarget;
        if (performanceElement) {
            // let target = parseFloat(sumTarget);
            var className = 'per-red';
            if (pef > 0) {
                className = 'per-green';
            }
            var txt = '<label class="' + className + '">' + this.getCurrency(pef) + '</label>';
            performanceElement.innerHTML = txt;
        }
        //========================== RM Incentive ==================================
        var teamAUM_Element = document.getElementById('aum_val');
        var salaryElement = document.getElementById('hide-salary');
        var salaryCaptionElement = document.getElementById('caption_salary');
        var incentiveSharingElement = document.getElementById('incentive');
        var rmPromotionElement = document.getElementById('promotion_val');
        var rmTotalIncentiveCaption = document.getElementById('caption_totalPay');
        var rmTotalIncentiveElement = document.getElementById('hide-totalPay');
        // if (teamAUM_Element) {teamAUM_Element.innerHTML = this.getCurrency(this.dataTeam.totalAUM);}
        if (salaryCaptionElement) {
            salaryCaptionElement.innerHTML = 'Salary:';
        }
        var sumSalary = 0;
        var salaryDetail = '';
        if (salaries.length > 0) {
            for (var i = 0; i < salaries.length; i++) {
                var t = salaries[i];
                sumSalary += parseInt(t.base_salary);
                salaryDetail += t.base_salary + ",";
            }
        }
        else {
            sumSalary = this.user.salary;
            salaryDetail = this.user.salary + "";
        }
        this.sumSalary = sumSalary;
        var totalSharing = 0;
        var txtTotalSharing = '0';
        var txtPayPromotionRM = '0';
        var payPromotionRM = 0;
        if (pef > 0) {
            // ============== ถ้า RM เป็น Freelance ============================
            if (this.DATAs.profile.ic_code.indexOf('F') === 0) {
                totalSharing = 0;
            }
            else {
                // ============== ถ้า RM เป็น ประจำ ============================
                totalSharing = pef * this.user.incentive;
                txtTotalSharing = "<a href=\"#\" title=\"".concat(this.getCurrency(pef), " x ").concat(this.user.incentive, "\">").concat(this.getCurrency(totalSharing), "</a>");
                txtPayPromotionRM = this.getCurrency(this.user.payPromotion.total_reward);
                payPromotionRM = this.user.payPromotion.total_reward;
            }
        }
        if (incentiveSharingElement) {
            incentiveSharingElement.innerHTML = txtTotalSharing;
        }
        if (rmPromotionElement) {
            rmPromotionElement.innerHTML = txtPayPromotionRM;
        }
        var totalIncentive = sumSalary + totalSharing + payPromotionRM;
        this.totalIncentive = totalIncentive;
        if (rmTotalIncentiveCaption) {
            rmTotalIncentiveCaption.innerHTML = 'Total:';
        }
        // if (rmTotalIncentiveElement) {rmTotalIncentiveElement.innerHTML = this.getCurrency(totalIncentive)}
        var textTotalPay = this.getCurrency(this.totalIncentive);
        if (salaryElement) {
            var text = void 0;
            if (this.DATAs.profile.ic_code.indexOf('F') === 0) {
                text = totalFee;
            }
            else {
                text = this.getCurrency(sumSalary);
            }
            if (this.permission == 1 || this.permission == 2) {
                text = "########";
                textTotalPay = "########";
            }
            else if (this.permission == 3) {
                text = "########";
                textTotalPay = "########";
            }
            salaryElement.textContent = text;
        }
        if (rmTotalIncentiveElement) {
            rmTotalIncentiveElement.innerHTML = textTotalPay;
        }
        //========================== WCC Revenue ==================================
        var wccFrontEndFeeElement = document.getElementById('caption_feeSummary');
        var wccTrailingFeeElement = document.getElementById('caption_wccTrailingFee');
        var wccPromotionFeeElement = document.getElementById('wcc_promotion_val');
        var wccTotalRevenueElement = document.getElementById('caption_WCCPerf');
        var netRevenueElement = document.getElementById('value_gp');
        var netSharingElement = document.getElementById('caption_gp');
        var wccFrontEndFee = this.DATAs['7grandTotalWCCFrontEndFee'];
        var wccTrailingFee = this.getWCCTrailingFee(trailing);
        var wccPromotion = this.user.payPromotion.feeAfterWithholdingTaxAndSharing;
        var totalRevenue = wccFrontEndFee + wccTrailingFee + wccPromotion;
        // let totalIncentive =this.user.totalIcentive;
        var netRevenue = totalRevenue - totalIncentive;
        var netSharing = netRevenue / totalRevenue * 100;
        if (wccFrontEndFeeElement) {
            wccFrontEndFeeElement.innerHTML = this.getCurrency(wccFrontEndFee);
        }
        if (wccTrailingFeeElement) {
            wccTrailingFeeElement.innerHTML = this.getCurrency(wccTrailingFee);
        }
        if (wccPromotionFeeElement) {
            wccPromotionFeeElement.innerHTML = this.getCurrency(wccPromotion);
        }
        if (wccTotalRevenueElement) {
            wccTotalRevenueElement.innerHTML = this.getCurrency(totalRevenue);
        }
        if (netRevenueElement) {
            netRevenueElement.innerHTML = this.getCurrency(netRevenue);
        }
        if (netSharingElement) {
            netSharingElement.innerHTML = this.getCurrency(netSharing) + "%";
        }
        var _ic = this.DATAs.profile.ic_code;
        var _target = sumTarget;
        var _fontEndFee = this.user.frontEndFee;
        var _trailingFee = sumTrailingFee;
        var _total = totalFee;
        var _perf = pef;
        var _wccFrontEndFee = wccFrontEndFee;
        var _wccTrailingFee = wccTrailingFee;
        var display = "\n            <table border='1' style='padding:1em'>\n                <tr>\n                    <td style='padding:1em'> ".concat(_ic, " </td>\n                    <td style='padding:1em'> ").concat(_target, " </td>\n                    <td style='padding:1em'> ").concat(_fontEndFee, " </td>\n                    <td style='padding:1em'> ").concat(_trailingFee, " </td>\n                    <td style='padding:1em'> ").concat(_total, " </td>\n                    <td style='padding:1em'> ").concat(_perf, " </td>\n                    <td style='padding:1em'> ").concat(_wccFrontEndFee, " </td>\n                    <td style='padding:1em'> ").concat(_wccTrailingFee, " </td>\n                </tr>\n            </table> ");
        var wccDisplay = "\n            <table border='1' style='padding:1em'>\n                <tr>\n                    <td style='padding:1em'> ".concat(_wccFrontEndFee, " </td>\n                    <td style='padding:1em'> ").concat(_wccTrailingFee, " </td>\n                </tr>\n            </table> ");
        var exElement = document.getElementById('display4excel');
        var wccExElement = document.getElementById('display4excelWCC');
        // if (exElement) {
        //     exElement.innerHTML =display
        //         // เพิ่มการเลือกข้อความและคัดลอกไป Clipboard
        //     const textarea = document.createElement('textarea');
        //     textarea.value = display;
        //     document.body.appendChild(textarea);
        //     textarea.select();
        //     document.execCommand("copy");
        //     document.body.removeChild(textarea);
        //     alert("Data copied to clipboard!"); // แจ้งเตือนเมื่อคัดลอกสำเร็จ
        // }
        // if (wccExElement) {wccExElement.innerHTML =wccDisplay}
        // console.log(display);
    };
    TransactionTable.prototype.getUserMetrics = function (st, ed, ic_code) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "./targets";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    // เพิ่ม headers ที่จำเป็น เช่น Authorization ถ้าจำเป็น
                                    // 'Authorization': 'Bearer YOUR_TOKEN'
                                },
                                body: JSON.stringify({
                                    startDate: st,
                                    endDate: ed,
                                    ic_code: ic_code
                                })
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        console.log(data);
                        return [2 /*return*/, data];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error fetching sharing data:', error_1);
                        throw error_1; // โยน error กลับไปเพื่อให้ผู้ใช้จัดการ
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TransactionTable.prototype.getTrailingFee = function (data) {
        if (data.length > 0) {
            return data[0].rmTrailingFee;
        }
        else {
            return 0;
        }
    };
    TransactionTable.prototype.getTrailingDate = function (json) {
        if (json.length > 0) {
            var date = new Date(json[0].month_active);
            return "(" + this.formatDateToString(date) + ")";
        }
        else {
            return "";
        }
    };
    TransactionTable.prototype.formatDateToString = function (date) {
        var day = String(date.getDate()).padStart(2, '0'); // แปลงวันที่เป็น 2 หลัก
        var month = String(date.getMonth() + 1).padStart(2, '0'); // แปลงเดือนเป็น 2 หลัก (+1 เพราะ getMonth() เริ่มจาก 0)
        var year = date.getFullYear(); // รับค่า ค.ศ.
        return "".concat(day, "/").concat(month, "/").concat(year); // รวมค่าที่ได้ในรูปแบบ DD-MM-YYYY
    };
    TransactionTable.prototype.getTotalRmTrailingFee = function (data) {
        // กรองข้อมูลโดยเลือก `rmTrailingFee` ล่าสุดในแต่ละเดือน
        var latestPerMonth = data.reduce(function (acc, curr) {
            var month = curr.month;
            // ถ้ายังไม่มีข้อมูลในเดือนนี้ หรืออัปเดตใหม่กว่า
            if (!acc[month] || new Date(curr.updated) > new Date(acc[month].updated)) {
                acc[month] = curr;
            }
            return acc;
        }, {});
        // ดึงค่าจาก `rmTrailingFee` และรวมผลลัพธ์ทั้งหมด
        return Object.values(latestPerMonth).reduce(function (sum, item) { return sum + item.rmTrailingFee; }, 0);
    };
    TransactionTable.prototype.getTotalWCCTrailingFee = function (data) {
        // กรองข้อมูลโดยเลือก `rmTrailingFee` ล่าสุดในแต่ละเดือน
        var latestPerMonth = data.reduce(function (acc, curr) {
            var month = curr.month;
            // ถ้ายังไม่มีข้อมูลในเดือนนี้ หรืออัปเดตใหม่กว่า
            if (!acc[month] || new Date(curr.updated) > new Date(acc[month].updated)) {
                acc[month] = curr;
            }
            return acc;
        }, {});
        // ดึงค่าจาก `rmTrailingFee` และรวมผลลัพธ์ทั้งหมด
        return Object.values(latestPerMonth).reduce(function (sum, item) { return sum + item.wccTrailingFee; }, 0);
    };
    TransactionTable.prototype.getWCCTrailingFee = function (data) {
        if (data.length > 0) {
            return data[0].wccTrailingFee;
        }
        else {
            return 0;
        }
    };
    TransactionTable.prototype.revealSalary = function (id) {
        // ค้นหา element ด้วย id
        var element = document.getElementById(id);
        if (element && element.textContent === "########") {
            if (this.permission !== 3) {
                if (id == 'hide-salary') {
                    element.textContent = this.getCurrency(this.sumSalary);
                }
                else if (id == 'hide-totalPay') {
                    element.textContent = this.getCurrency(this.totalIncentive);
                }
            }
        }
    };
    return TransactionTable;
}());
