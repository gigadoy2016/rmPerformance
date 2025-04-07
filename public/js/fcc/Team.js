var Team = /** @class */ (function () {
    function Team(DATAS) {
        this.trailingFee = [];
        this.salaryTeam = 0;
        this.targetTeam = 0;
        this.trailingTeam = 0;
        this.team = [];
        this.sumPaySharing = 0;
        this.payPromotion = 0;
        this.wccPromotion = 0;
        this.totalAUM = 0;
        this.grandTotalSubAmount = 0;
        this.grandTotalSubFrontEndFee = 0;
        this.grandTotalSwiAmount = 0;
        this.grandTotalSwiFrontEndFee = 0;
        this.grandTotalAmount = 0;
        this.grandTotalFrontEndFee = 0;
        this.grandTotalWCCFrontEndFee = 0;
        this.fundCodeTeam = [];
        this.wccSumPromotion = 0;
        this.DATAS = DATAS;
        this.team_id = DATAS.team.team_id;
        this.team_code = DATAS.team.name;
        this.team_name = DATAS.team.remark;
        this.profile = DATAS.team;
        this.trailingFee = DATAS.trailing;
        this.incentive = DATAS.incentive;
        var ans = DATAS.team.member;
        if (ans !== undefined) {
            this.member = this.convertToJSON(ans).member;
        }
        this.target = DATAS.target;
        this.trasactions = DATAS.trans;
        this.salary = this.getSalary();
    }
    // public getTotalAUM(){
    //     const AUM = this.DATAS.AUM;
    //     let members = this.member;
    // }
    Team.prototype.getTargetByIC = function (ic_code) {
        var objTarget = this.target.find(function (item) { return item.ic_code === ic_code; });
        if (objTarget == undefined) {
            return 0;
        }
        return objTarget.target;
    };
    Team.prototype.getIncentiveByIC = function (ic_code) {
        var objIncentive = this.incentive.find(function (item) { return item.ic_code === ic_code; });
        return objIncentive.incentive;
    };
    Team.prototype.getSalary = function () {
        var salary = this.DATAS.salary[0].base_salary;
        this.salary = parseInt(salary);
        return this.salary;
    };
    Team.prototype.getSalaryTeam = function () {
        var members = this.member;
        var salarys = this.DATAS.salary;
        var sumSalary = 0;
        var _loop_1 = function (i) {
            var member = members[i];
            var salary = salarys.find(function (item) { return item.employee_id == member; });
            sumSalary += parseInt(salary.base_salary);
        };
        // console.log(this.DATAS);
        for (var i = 0; i < members.length; i++) {
            _loop_1(i);
        }
        return sumSalary;
    };
    Team.prototype.getTargetTeam = function () {
        var members = this.member;
        var targets = this.DATAS.target;
        var sumTarget = 0;
        var _loop_2 = function (i) {
            var member = members[i];
            var target = targets.find(function (item) { return item.ic_code == member; });
            sumTarget += parseInt(target.target);
        };
        for (var i = 0; i < members.length; i++) {
            _loop_2(i);
        }
    };
    Team.prototype.getValueTeam = function () {
        var members = this.member;
        var targets = this.DATAS.target;
        var salarys = this.DATAS.salary;
        var trailings = this.DATAS.trailing;
        var AUMs = this.DATAS.AUM;
        var sumTarget = 0;
        var sumSalary = 0;
        var sumTrailing = 0;
        var sumTrailingWCC = 0;
        var sumAUM = 0;
        var _loop_3 = function (i) {
            var member = members[i];
            var target = targets.find(function (item) { return item.ic_code == member; });
            var salary = salarys.find(function (item) { return item.employee_id == member; });
            var trailing = trailings.find(function (item) { return item.employee_id == member; });
            var AUM = AUMs.find(function (item) { return item.IC == member; });
            sumTarget += parseInt(target.target);
            sumSalary += parseInt(salary.base_salary);
            if (trailing != undefined) {
                sumTrailing += parseInt(trailing.rmTrailingFee);
                sumTrailingWCC += parseInt(trailing.wccTrailingFee);
            }
            if (AUM != undefined) {
                sumAUM += parseInt(AUM.TotalOutstandingBalanceAmount);
            }
        };
        for (var i = 0; i < members.length; i++) {
            _loop_3(i);
        }
        this.salaryTeam = sumSalary;
        this.targetTeam = sumTarget;
        this.trailingTeam = sumTrailing;
        this.wccTrailingFee = sumTrailingWCC;
        this.totalAUM = sumAUM;
        return [sumSalary, sumTarget, sumTrailing, sumTrailingWCC, sumAUM];
    };
    Team.prototype.getMember = function () {
        return this.member;
    };
    Team.prototype.getTransactions = function () {
        return this.trasactions;
    };
    Team.prototype.convertToJSON = function (input) {
        // ปรับโครงสร้างข้อความให้เป็น JSON ที่ถูกต้อง
        var corrected = input
            .replace("{", '{"')
            .replace(":", '":')
            .replace("[", '[')
            .replace("]", ']')
            .replace("}", '}');
        try {
            // แปลงข้อความเป็น JSON object
            return JSON.parse(corrected);
        }
        catch (error) {
            console.error("Error decoding JSON:", error);
            return null; // คืนค่า null หากแปลงไม่สำเร็จ
        }
    };
    Team.prototype.addMember = function (u) {
        this.team.push(u);
    };
    Team.prototype.getTeam = function () {
        return this.team;
    };
    Team.prototype.getData = function () {
        var _a = this.getValueTeam(), salary = _a[0], targetTeam = _a[1], trailingTeam = _a[2], wccTrailingTeam = _a[3], AUM = _a[4];
        var totalIcentive = salary + this.sumPaySharing + this.payPromotion;
        var obj = {
            team_id: this.team_id,
            teamName: this.team_name,
            member: this.member,
            team: this.team,
            target: targetTeam,
            salary: salary,
            incentive: this.incentive,
            trailing: this.trailingFee,
            rmTrailingFee: trailingTeam,
            wccTrailingFee: wccTrailingTeam,
            sharing: this.sharing,
            rmPromotion: this.payPromotion,
            wccPromotion: this.wccPromotion,
            totalAUM: AUM,
            '1grandTotalSubAmount': this.grandTotalSubAmount,
            '2grandTotalSubFontEndFee': this.grandTotalSubFrontEndFee,
            '3grandTotalSwiAmount': this.grandTotalSwiAmount,
            '4grandTotalSwiFontEndFee': this.grandTotalSwiFrontEndFee,
            '5grandTotalAmount': this.grandTotalAmount,
            '6grandTotalFrontEndFee': this.grandTotalFrontEndFee,
            '7grandTotalWCCFrontEndFee': this.grandTotalWCCFrontEndFee,
            'fundCodeTeam': this.fundCodeTeam,
            'sumPaySharing': this.sumPaySharing,
            totalIcentive: totalIcentive
        };
        return obj;
    };
    Team.prototype.getTarget = function () {
        var _this = this;
        var objTarget = this.target.find(function (item) { return item.ic_code === _this.team_code; });
        return objTarget.target;
    };
    Team.prototype.getTrailingByIC = function (ic_code) {
        var objTrailing = this.trailingFee.find(function (item) { return item.employee_id === ic_code; });
        if (objTrailing != undefined) {
            this.rmTrailingFee = objTrailing.rmTrailingFee;
            this.wccTrailingFee = objTrailing.wccTrailingFee;
        }
        else {
            this.rmTrailingFee = 0;
            this.wccTrailingFee = 0;
        }
        return this.rmTrailingFee;
    };
    Team.prototype.mergeTransactions = function () {
        for (var i = 0; i < this.team.length; i++) {
            var member = this.team[i];
            this.grandTotalSubAmount += member['1grandTotalSubAmount'];
            this.grandTotalSubFrontEndFee += member['2grandTotalSubFontEndFee'];
            this.grandTotalSwiAmount += member['3grandTotalSwiAmount'];
            this.grandTotalSwiFrontEndFee += member['4grandTotalSwiFontEndFee'];
            this.grandTotalAmount += member['5grandTotalAmount'];
            this.grandTotalFrontEndFee += member['6grandTotalFrontEndFee'];
            this.grandTotalWCCFrontEndFee += member['7grandTotalWCCFrontEndFee'];
            this.sumPaySharing += member.rmPay4Sharing;
            if (member.payPromotion !== undefined) {
                this.payPromotion += member.payPromotion.total_reward;
                this.wccPromotion += member.payPromotion.feeAfterWithholdingTaxAndSharing;
            }
            var funds = member.fund_codes;
            if (i == 0) {
                // fundCodeTeam = funds
                this.fundCodeTeam = Array.from(funds);
            }
            else {
                console.log(funds);
                var _loop_4 = function (j) {
                    var fund = funds[j];
                    var fund_code = fund.fundcode;
                    var target = this_1.fundCodeTeam.find(function (item) { return item.fundcode === fund_code; });
                    if (target) {
                        target.subAmount += fund.subAmount;
                        target.subFrontEndFee += fund.subFrontEndFee;
                        target.swiAmount += fund.swiAmount;
                        target.swiFrontEndFee += fund.swiFrontEndFee;
                        target.totalAmount += fund.totalAmount;
                        target.totalFrontEndFee += fund.totalFrontEndFee;
                        target.wccFronEndFee += fund.wccFronEndFee;
                    }
                    else {
                        this_1.fundCodeTeam.push(fund);
                    }
                };
                var this_1 = this;
                for (var j = 0; j < funds.length; j++) {
                    _loop_4(j);
                }
            }
        }
        // console.log(this.fundCodeTeam);
    };
    return Team;
}());
