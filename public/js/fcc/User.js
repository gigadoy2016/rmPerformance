var User = /** @class */ (function () {
    // private backEndWccSharing:any = [
    //     {AMC:"KTAM",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
    //     {AMC:"EASTSPRING",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
    //     {AMC:"KASSET",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
    //     {AMC:"ASSETFUND",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
    //     {AMC:"PRINCIPAL",sharing:0.7},
    //     {AMC:"MFC",sharing:0.7},
    //     {AMC:"SCBAM",sharing:0.7},
    //     {AMC:"ONEAM",sharing:0.7},
    //     {AMC:"UOBAM",sharing:0.7},
    //     {AMC:"LHFUND",sharing:0.7},
    //     {AMC:"KSAM",sharing:0.7},
    //     {AMC:"KKPAM",sharing:0.8},
    //     {AMC:"ABERDEEN",sharing:0.8}
    // ];
    function User(ic_code, transactions, amcSharing) {
        this.incentive = 0;
        this.fundSharing = [];
        this.transactions = [];
        this.sharingDefault = 0.7;
        this.rmPay4Sharing = 0;
        this.performance = 0;
        this.rateWithHolding = 0;
        this.icCode = ic_code;
        this.fundSharing = amcSharing;
        this.transactions = transactions;
        console.log("==== New Object User ====");
        console.log(this.fundSharing);
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
        var grandTotalSaFrontEndFee = 0;
        var grandWaitingAmount = 0;
        var rm_sharing = 0.7;
        var sa_sharing = 0.7;
        var sharingObj;
        trans.sort(function (x, y) { return x.fund_code.localeCompare(y.fund_code); });
        // console.log(trans);
        // console.log(" ------------------ Fund Sharing -------------------");
        if (this.fundSharing) {
            this.fundSharing.sort(function (a, b) { return new Date(b.start_date).getTime() - new Date(a.start_date).getTime(); });
        }
        var fundcodes = [];
        var i = 1;
        var _loop_1 = function (transaction) {
            // ค้นหา fundcode ที่มีอยู่แล้วใน fundcodes
            var fund = fundcodes.find(function (f) { return f.fundcode === transaction.fund_code; });
            var fee = this_1.string2Number(transaction.fee);
            var type = transaction.transaction_type;
            var sharing = this_1.sharingDefault;
            // let _sharing;
            if (this_1.fundSharing) {
                // _sharing = this.fundSharing.find(f => f.fund_code === transaction.fund_code);
                sharingObj = this_1.fundSharing.find(function (f) { return f.fund_code === transaction.fund_code; });
            }
            // let _sharing = this.fundSharing.find(f => f.fund_code === transaction.fund_code);
            var status_1 = transaction.status;
            var amc_name = transaction.amc_code;
            // if(_sharing !== undefined){
            //     sharing = parseFloat(_sharing.sharing);
            //     sharing = this.getValidateFreelancer(this.icCode,amc_name,transaction.transaction_date,sharing);
            // }else{
            //     sharing = this.getValidateFreelancer(this.icCode,amc_name,transaction.transaction_date,sharing);
            // }
            if (sharingObj !== undefined) {
                rm_sharing = parseFloat(sharingObj.rm_sharing);
                sa_sharing = parseFloat(sharingObj.sa_sharing);
                // sharing = this.getValidateFreelancer(this.icCode,amc_name,transaction.transaction_date,sharing);
            }
            else {
                // sharing = this.getValidateFreelancer(this.icCode,amc_name,transaction.transaction_date,sharing);
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
                        saSharing: sa_sharing,
                        rmSharing: rm_sharing,
                        saFrontEndFee: 0,
                        saSubFEF: 0,
                        saSwiFEF: 0,
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
                        fund.subWH = fund.subFee * this_1.rateWithHolding;
                        // fund.subNetFee = fund.subFee - fund.subWH;
                        fund.subNetFee = fund.subFee;
                        // let fee = this.calculationSharing(transaction,fund.subNetFee,sharing,fund.incentive);
                        fund.saSubFEF = fund.subNetFee * sa_sharing;
                        fund.subFrontEndFee = fund.subNetFee * rm_sharing;
                        fund.saSharing = sa_sharing;
                        fund.rmSharing = rm_sharing;
                        // fund.saSubFEF = fund.subNetFee * amcSharing.sharing;
                        // fund.subFrontEndFee = Math.floor(fund.saSubFEF * sharing * inc);
                        // fund.saSubFEF = fund.subNetFee * sharing;
                        // if(amc_name !=='PRINCIPAL'){
                        //     fund.subFrontEndFee = Math.floor(fund.saSubFEF * 0.7);
                        // }else{
                        //     fund.subFrontEndFee = Math.floor(fund.saSubFEF);
                        // }
                    }
                    else if (type === 'SWI') {
                        fund.swiAmount += Math.floor(this_1.string2Number(transaction.confirmed_amount));
                        fund.swiFee += Math.floor(this_1.string2Number(transaction.fee));
                        fund.swiWH = fund.swiFee * this_1.rateWithHolding;
                        // fund.swiNetFee = fund.swiFee - fund.swiWH;
                        fund.swiNetFee = fund.swiFee;
                        // let fee = this.calculationSharing(transaction,fund.swiNetFee,sharing,fund.incentive);
                        fund.saSwiFEF = fund.swiNetFee * sa_sharing;
                        fund.swiFrontEndFee = fund.swiNetFee * rm_sharing;
                        fund.saSharing = sa_sharing;
                        fund.rmSharing = rm_sharing;
                        // fund.saSwiFEF = fund.swiNetFee * amcSharing.sharing;
                        // fund.swiFrontEndFee = Math.floor(fund.saSwiFEF * sharing * inc);
                        // fund.saSwiFEF = fund.swiNetFee * sharing;
                        // if(amc_name !=='PRINCIPAL'){
                        //     fund.swiFrontEndFee = Math.floor(fund.saSwiFEF * 0.7);
                        // }else{
                        //     fund.swiFrontEndFee = Math.floor(fund.saSwiFEF);
                        // }
                    }
                    // คำนวณ totalAmount และ totalFrontEndFee
                    // fund.saFrontEndFee = (fund.subNetFee + fund.swiNetFee) * inc;
                    fund.saFrontEndFee = fund.saSwiFEF + fund.saSubFEF;
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
            grandTotalSaFrontEndFee += fundcodes[i_1].saFrontEndFee;
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
            '7grandTotalSaFrontEndFee': grandTotalSaFrontEndFee,
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
    // public getSharingByAmcCode(amcCode) {
    //     let result = this.backEndWccSharing.find(item => item.AMC === amcCode);
    //     return result ? result.sharing : null; 
    // }
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
    return User;
}());
