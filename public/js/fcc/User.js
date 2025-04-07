var User = /** @class */ (function () {
    function User(ic_code, transactions, amcSharing) {
        this.incentive = 0;
        this.fundSharing = [];
        this.transactions = [];
        this.sharingDefault = 0.7;
        this.rmPay4Sharing = 0;
        this.performance = 0;
        this.backEndWccSharing = [
            { AMC: "KTAM", sharing: 1, fundcode: "all", "enable_st": "2025-02-01" },
            { AMC: "EASTSPRING", sharing: 1, fundcode: "all", "enable_st": "2025-02-01" },
            { AMC: "KASSET", sharing: 1, fundcode: "all", "enable_st": "2025-02-01" },
            { AMC: "ASSETFUND", sharing: 1, fundcode: "all", "enable_st": "2025-02-01" },
            { AMC: "PRINCIPAL", sharing: 0.7 },
            { AMC: "MFC", sharing: 0.7 },
            { AMC: "SCBAM", sharing: 0.7 },
            { AMC: "ONEAM", sharing: 0.7 },
            { AMC: "UOBAM", sharing: 0.7 },
            { AMC: "LHFUND", sharing: 0.7 },
            { AMC: "KSAM", sharing: 0.7 },
            { AMC: "KKPAM", sharing: 0.8 },
            { AMC: "ABERDEEN", sharing: 0.8 }
        ];
        this.icCode = ic_code;
        this.fundSharing = amcSharing;
        this.transactions = transactions;
    }
    User.prototype.setUserData = function (user) {
        this.nameEng = user.name_eng;
        this.lastnameEng = user.lastname_eng;
        this.nameTh = user.name_th;
        this.lastnameTh = user.lastname_th;
        this.department = user.department;
        this.target = user.target;
        this.icCode = user.ic_code;
        this.trailingFee = user.trailing_fee;
        this.startDate = new Date(user.start_date);
        this.profile = user;
        if (user.incentive) {
            this.incentive = user.incentive[0].incentive;
        }
        if (user.salary != undefined) {
            this.setSalary(user.salary);
        }
    };
    User.prototype.setSalary = function (arr) {
        if (arr.length !== undefined && arr.length > 0) {
            this.salary = this.string2Number(arr[0].base_salary);
        }
    };
    User.prototype.setPromotion = function (promotion) {
        this.payPromotion = promotion;
        if (this.detail !== undefined) {
            this.detail.payPromotion = promotion;
        }
    };
    User.prototype.getTransactionsByIC = function () {
        var _this = this;
        var transactions = this.transactions.filter(function (transaction) { return transaction.ic == _this.icCode; });
        // console.log(transactions);
        return transactions;
    };
    User.prototype.getFundCodeName = function (trans) {
        var uniqueFundCodes = Array.from(new Set(trans.map(function (item) { return item.fund_code; })));
        return uniqueFundCodes;
    };
    User.prototype.setFundSharing = function (sharing) {
        this.fundSharing = sharing.sharing;
    };
    User.prototype.setIncentive = function (incentive) {
        this.incentive = incentive;
    };
    User.prototype.setTrailingFee = function (trailingFee) {
        this.trailingFee = trailingFee;
    };
    User.prototype.getIcCode = function () {
        return this.icCode;
    };
    User.prototype.setTarget = function (target) {
        this.target = target;
    };
    User.prototype.getTarget = function () {
        return this.target;
    };
    User.prototype.getSalary = function () {
        return this.salary;
    };
    User.prototype.getFundCode = function (trans) {
        var grandTotalSubAmount = 0;
        var grandTotalSubFontEndFee = 0;
        var grandTotalSwiAmount = 0;
        var grandTotalSwiFontEndFee = 0;
        var grandTotalAmount = 0;
        var grandTotalFrontEndFee = 0;
        var grandTotalWCCFrontEndFee = 0;
        var grandWaitingAmount = 0;
        trans.sort(function (x, y) { return x.fund_code.localeCompare(y.fund_code); });
        // console.log(trans);
        // console.log(" ------------------ Fund Sharing -------------------");
        if (this.fundSharing) {
            this.fundSharing.sort(function (a, b) { return new Date(b.promotion_start_date).getTime() - new Date(a.promotion_start_date).getTime(); });
        }
        var fundcodes = [];
        var i = 1;
        var _loop_1 = function (transaction) {
            // ค้นหา fundcode ที่มีอยู่แล้วใน fundcodes
            var fund = fundcodes.find(function (f) { return f.fundcode === transaction.fund_code; });
            var fee = this_1.string2Number(transaction.fee);
            var type = transaction.transaction_type;
            var sharing = this_1.sharingDefault;
            var _sharing = this_1.fundSharing.find(function (f) { return f.fund_code === transaction.fund_code; });
            var status_1 = transaction.status;
            var amc_name = transaction.amc_code;
            if (_sharing !== undefined) {
                sharing = parseFloat(_sharing.sharing);
                sharing = this_1.getValidateFreelancer(this_1.icCode, amc_name, transaction.transaction_date, sharing);
            }
            else {
                sharing = this_1.getValidateFreelancer(this_1.icCode, amc_name, transaction.transaction_date, sharing);
            }
            if (type === 'SUB' || type === 'SWI') {
                if (!fund) {
                    // หากยังไม่มี fundcode นี้ใน fundcodes ให้สร้างใหม่
                    fund = {
                        fundcode: transaction.fund_code,
                        transactions: [],
                        subAmount: 0,
                        subFee: 0,
                        subWH: 0,
                        subNetFee: 0,
                        subFrontEndFee: 0,
                        swiAmount: 0,
                        swiFee: 0,
                        swiWH: 0,
                        swiNetFee: 0,
                        swiFrontEndFee: 0,
                        totalAmount: 0,
                        totalFrontEndFee: 0,
                        sharing: sharing,
                        wccSharing: sharing,
                        rmSharing: 0.7,
                        wccFrontEndFee: 0,
                        wccSubFEF: 0,
                        wccSwiFEF: 0,
                        waitingAmount: 0,
                        incentive: this_1.incentive
                    };
                    fundcodes.push(fund);
                }
                if (status_1 === "ALLOTTED") {
                    // เพิ่ม transaction ในรายการ
                    fund.transactions.push(transaction);
                    // อัปเดตค่าตามประเภท transaction
                    // let type = transaction.transaction_type;
                    // let amcSharing = this.backEndWccSharing.find(f => f.AMC === transaction.amc_code);
                    // if(!amcSharing){
                    //     fund.sharing = amcSharing.sharing = 0.7;
                    // }else if (amcSharing.fundcode =='all'){
                    //     let start = new Date(amcSharing.enable_st);
                    //     let trans_date = new Date(transaction.transaction_date);
                    //     if(start < trans_date){
                    //         fund.sharing = sharing = amcSharing.sharing;
                    //     }
                    // }
                    // let inc = 1;
                    // if(transaction.ic.startsWith("F") ){
                    //     inc = fund.incentive;
                    // }else{
                    //     fund.incentive = inc;
                    // }
                    // if(status === "ALLOTTED"){
                    if (type === 'SUB') {
                        fund.subAmount += Math.floor(this_1.string2Number(transaction.confirmed_amount));
                        fund.subFee += Math.floor(this_1.string2Number(transaction.fee));
                        fund.subWH = fund.subFee * 0.03;
                        fund.subNetFee = fund.subFee - fund.subWH;
                        var fee_1 = this_1.calculationSharing(transaction, fund.subNetFee, sharing, fund.incentive);
                        fund.wccSubFEF = fee_1.wccResult;
                        fund.subFrontEndFee = fee_1.rmResult;
                        fund.wccSharing = fee_1.wccSharing;
                        fund.rmSharing = fee_1.rmSharing;
                        // fund.wccSubFEF = fund.subNetFee * amcSharing.sharing;
                        // fund.subFrontEndFee = Math.floor(fund.wccSubFEF * sharing * inc);
                        // fund.wccSubFEF = fund.subNetFee * sharing;
                        // if(amc_name !=='PRINCIPAL'){
                        //     fund.subFrontEndFee = Math.floor(fund.wccSubFEF * 0.7);
                        // }else{
                        //     fund.subFrontEndFee = Math.floor(fund.wccSubFEF);
                        // }
                    }
                    else if (type === 'SWI') {
                        fund.swiAmount += Math.floor(this_1.string2Number(transaction.confirmed_amount));
                        fund.swiFee += Math.floor(this_1.string2Number(transaction.fee));
                        fund.swiWH = fund.swiFee * 0.03;
                        fund.swiNetFee = fund.swiFee - fund.swiWH;
                        var fee_2 = this_1.calculationSharing(transaction, fund.swiNetFee, sharing, fund.incentive);
                        fund.wccSwiFEF = fee_2.wccResult;
                        fund.swiFrontEndFee = fee_2.rmResult;
                        fund.wccSharing = fee_2.wccSharing;
                        fund.rmSharing = fee_2.rmSharing;
                        // fund.wccSwiFEF = fund.swiNetFee * amcSharing.sharing;
                        // fund.swiFrontEndFee = Math.floor(fund.wccSwiFEF * sharing * inc);
                        // fund.wccSwiFEF = fund.swiNetFee * sharing;
                        // if(amc_name !=='PRINCIPAL'){
                        //     fund.swiFrontEndFee = Math.floor(fund.wccSwiFEF * 0.7);
                        // }else{
                        //     fund.swiFrontEndFee = Math.floor(fund.wccSwiFEF);
                        // }
                    }
                    // คำนวณ totalAmount และ totalFrontEndFee
                    // fund.wccFrontEndFee = (fund.subNetFee + fund.swiNetFee) * inc;
                    fund.wccFrontEndFee = fund.wccSwiFEF + fund.wccSubFEF;
                    fund.totalAmount = fund.subAmount + fund.swiAmount;
                    fund.totalFrontEndFee = Math.floor(fund.subFrontEndFee + fund.swiFrontEndFee);
                }
                else if (status_1 === "WAITING" && (type === 'SUB' || type === 'SWI')) {
                    if (transaction.amount !== null) {
                        fund.waitingAmount = parseFloat(transaction.amount.replace(/,/g, ''));
                    }
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, trans_1 = trans; _i < trans_1.length; _i++) {
            var transaction = trans_1[_i];
            _loop_1(transaction);
        }
        for (var i_1 = 0; i_1 < fundcodes.length; i_1++) {
            grandTotalSubAmount += fundcodes[i_1].subAmount;
            grandTotalSubFontEndFee += fundcodes[i_1].subFrontEndFee;
            grandTotalSwiAmount += fundcodes[i_1].swiAmount;
            grandTotalSwiFontEndFee += fundcodes[i_1].swiFrontEndFee;
            grandTotalAmount += fundcodes[i_1].totalAmount;
            grandTotalFrontEndFee += fundcodes[i_1].totalFrontEndFee;
            grandTotalWCCFrontEndFee += fundcodes[i_1].wccFrontEndFee;
            grandWaitingAmount += fundcodes[i_1].waitingAmount;
        }
        this.performance = grandTotalFrontEndFee + this.trailingFee - this.target;
        if (this.performance <= 0) {
            this.performance = 0;
            this.rmPay4Sharing = 0;
        }
        else {
            this.rmPay4Sharing = Math.floor(this.performance * this.incentive);
        }
        // let promotion = this.payPromotion.total_reward;
        var user = {
            'ic_code': this.icCode,
            'fund_codes': fundcodes,
            '1grandTotalSubAmount': grandTotalSubAmount,
            '2grandTotalSubFontEndFee': grandTotalSubFontEndFee,
            '3grandTotalSwiAmount': grandTotalSwiAmount,
            '4grandTotalSwiFontEndFee': grandTotalSwiFontEndFee,
            '5grandTotalAmount': grandTotalAmount,
            '6grandTotalFrontEndFee': grandTotalFrontEndFee,
            '7grandTotalWCCFrontEndFee': grandTotalWCCFrontEndFee,
            'waitingAmount': grandWaitingAmount,
            'trailingFee': this.trailingFee,
            'profile': this.profile,
            'target': this.target,
            'incentive': this.incentive,
            'rmPay4Sharing': this.rmPay4Sharing,
            'performance': this.performance
        };
        this.frontEndFee = grandTotalFrontEndFee;
        // console.log("............................................................");
        // console.log(user);
        // console.log("............................................................");
        return this.detail = user;
    };
    User.prototype.getDetail = function () {
        return this.detail;
    };
    User.prototype.string2Number = function (str) {
        if (str == null || str == '') {
            return 0;
        }
        return parseFloat(str.replace(/,/g, ''));
    };
    User.prototype.gen = function () {
        var trans = this.getTransactionsByIC();
        return this.getFundCode(trans);
    };
    User.prototype.getSharingByAmcCode = function (amcCode) {
        var result = this.backEndWccSharing.find(function (item) { return item.AMC === amcCode; });
        return result ? result.sharing : null;
    };
    User.prototype.getValidateFreelancer = function (ic_code, amcCode, transactionDate, sharing) {
        var startDate = new Date('2024-01-31');
        var datePart = transactionDate.split(" ")[0];
        var parts = datePart.split("/");
        var date = "".concat(parts[2], "-").concat(parts[1], "-").concat(parts[0]);
        var transaction_date = new Date(date);
        if (ic_code.indexOf('F') === 0) {
            if (transaction_date > startDate) {
                // sharing = this.getSharingByAmcCode(amcCode);
                if (amcCode === 'ASSETFUND' || amcCode === 'KTAM' || amcCode === 'EASTSPRING' || amcCode === 'KASSET') {
                    if (sharing == undefined || sharing == 0.7) {
                        sharing = 1;
                    }
                }
            }
        }
        return sharing;
    };
    User.prototype.calculationSharing = function (tran, netFee, fundCodeSharing, incentive) {
        var ic_code = this.icCode;
        var wccSharing = 1;
        var rmSharing = 0;
        var wccResult = 0;
        var rmResult = 0;
        var tran_amc = tran.amc_code;
        var amc = ['KTAM', 'EASTSPRING', 'KASSET', 'ASSETFUND'];
        if (ic_code.indexOf('F') >= 0) { //
            if (amc.includes(tran_amc)) {
                wccSharing = 1;
                rmSharing = incentive;
                wccResult = netFee * wccSharing;
                rmResult = wccResult * rmSharing;
            }
            else {
                wccSharing = fundCodeSharing;
                rmSharing = incentive;
                wccResult = netFee * wccSharing;
                rmResult = wccResult * rmSharing;
            }
        }
        else if (amc.includes(tran_amc) && ic_code.indexOf('F') < 0) { //เป็นพนักงานประจำและซื้อกองใน 4 บลจ 100
            wccSharing = 1;
            rmSharing = 0.7;
            wccResult = netFee * wccSharing;
            rmResult = wccResult * rmSharing;
        }
        else { //เป็นพนักงานประจำและซื้อกองนอกเหนือ 4 บลจ 100
            wccSharing = fundCodeSharing;
            rmSharing = 1;
            wccResult = netFee * wccSharing;
            rmResult = wccResult * rmSharing;
        }
        return { 'wccResult': wccResult, 'rmResult': rmResult, 'wccSharing': wccSharing, 'rmSharing': rmSharing };
    };
    return User;
}());
