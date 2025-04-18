
class User{
    private nameEng:string;
    private lastnameEng:string;
    private nameTh:string
    private lastnameTh:string;
    private department:string;
    private icCode:string;
    private startDate:Date;
    private target:number;
    private trailingFee:number;
    private incentive:number=0;
    private fundSharing: Array<any> = [];
    private transactions:Array<any> = [];
    private sharingDefault :number = 0.7;
    private datas:any;
    private profile:any;
    private rmPay4Sharing:number = 0;

    private aum:any;
    private salary:number;
    private profitSharing:number;
    private payPromotion:any;
    private profigTotal:number;
    private frontEndFee:number;

    private wccFrontEndFee:number;
    private wccTrailingFee:number;
    private wccPromotion:number;
    private totalRevenue:number;
    private netRevenue:number;
    private netShareing:number;
    private performance:number = 0;
    private rateWithHolding:number = 0;

    private detail:any;

    private backEndWccSharing:any = [
        {AMC:"KTAM",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
        {AMC:"EASTSPRING",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
        {AMC:"KASSET",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
        {AMC:"ASSETFUND",sharing:1,fundcode:"all","enable_st":"2025-02-01"},
        {AMC:"PRINCIPAL",sharing:0.7},
        {AMC:"MFC",sharing:0.7},
        {AMC:"SCBAM",sharing:0.7},
        {AMC:"ONEAM",sharing:0.7},
        {AMC:"UOBAM",sharing:0.7},
        {AMC:"LHFUND",sharing:0.7},
        {AMC:"KSAM",sharing:0.7},
        {AMC:"KKPAM",sharing:0.8},
        {AMC:"ABERDEEN",sharing:0.8}
    ];

    constructor(ic_code,transactions,amcSharing){ 
        this.icCode = ic_code;
        this.fundSharing = amcSharing;
        this.transactions = transactions;
    }
    public setUserData(user){
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
        if(user.incentive){
            this.incentive = user.incentive[0].incentive;
        }
        if(user.salary != undefined){
            this.setSalary(user.salary);
        }
        
    }
    public setSalary(arr:Array<any>){
        if(arr.length !== undefined && arr.length >0){
            this.salary = this.string2Number(arr[0].base_salary);
        }
    }
    public setPromotion(promotion){
        this.payPromotion = promotion;
        if(this.detail !== undefined){
            this.detail.payPromotion = promotion;
        }
    }
    public getTransactionsByIC(){
        let transactions = this.transactions.filter(transaction => transaction.ic == this.icCode);
        // console.log(transactions);
        return transactions;
    }
    
    public getFundCodeName(trans){
        const uniqueFundCodes = Array.from(new Set(trans.map(item => item.fund_code)));
        return uniqueFundCodes;
    }
    public setFundSharing(sharing){
        this.fundSharing = sharing.sharing;
    }
    public setIncentive(incentive){
        this.incentive = incentive;
    }

    public setTrailingFee(trailingFee){
        this.trailingFee = trailingFee;
    }
    public getIcCode(){
        return this.icCode;
    }
    public setTarget(target){
        this.target = target;
    }

    public getTarget(){
        return this.target;
    }

    public getSalary(){
        return this.salary;
    }

    public getFundCode(trans){
        let grandTotalSubAmount = 0;
        let grandTotalSubFontEndFee = 0;
        let grandTotalSwiAmount = 0;
        let grandTotalSwiFontEndFee = 0;
        let grandTotalAmount = 0;
        let grandTotalFrontEndFee = 0;
        let grandTotalWCCFrontEndFee = 0;
        let grandWaitingAmount = 0;
        trans.sort((x, y) => x.fund_code.localeCompare(y.fund_code));
        // console.log(trans);
        // console.log(" ------------------ Fund Sharing -------------------");
        if(this.fundSharing){
            this.fundSharing.sort((a, b) => new Date(b.promotion_start_date).getTime() - new Date(a.promotion_start_date).getTime());
        }
        

        const fundcodes: Array<any> = [];
        let i = 1;
        for (const transaction of trans) {
            
            // ค้นหา fundcode ที่มีอยู่แล้วใน fundcodes
            let fund = fundcodes.find(f => f.fundcode === transaction.fund_code);
            let fee = this.string2Number(transaction.fee);
            let type = transaction.transaction_type;
            let sharing = this.sharingDefault;
            let _sharing;
            if(this.fundSharing){
                _sharing = this.fundSharing.find(f => f.fund_code === transaction.fund_code);    
            }
            // let _sharing = this.fundSharing.find(f => f.fund_code === transaction.fund_code);
            let status = transaction.status;
            let amc_name = transaction.amc_code;


            if(_sharing !== undefined){
                sharing = parseFloat(_sharing.sharing);
                sharing = this.getValidateFreelancer(this.icCode,amc_name,transaction.transaction_date,sharing);
            }else{
                sharing = this.getValidateFreelancer(this.icCode,amc_name,transaction.transaction_date,sharing);
            }
            
            if(type === 'SUB' || type === 'SWI'){
                if (!fund) {
                    // หากยังไม่มี fundcode นี้ใน fundcodes ให้สร้างใหม่
                    fund = {
                        fundcode: transaction.fund_code,
                        transactions: [],
                        subAmount: 0,
                        subFee: 0,
                        subWH:0,
                        subNetFee:0,
                        subFrontEndFee:0,
                        swiAmount: 0,
                        swiFee: 0,
                        swiWH:0,
                        swiNetFee:0,
                        swiFrontEndFee:0,
                        totalAmount: 0,
                        totalFrontEndFee: 0,
                        sharing:sharing,
                        wccSharing:sharing,
                        rmSharing:0.7,
                        wccFrontEndFee:0,
                        wccSubFEF:0,
                        wccSwiFEF:0,
                        waitingAmount:0,
                        incentive:this.incentive
                    };
                    fundcodes.push(fund);
                }
                if(status === "ALLOTTED"){

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
                        fund.subAmount +=Math.floor(this.string2Number(transaction.confirmed_amount));
                        fund.subFee += Math.floor(this.string2Number(transaction.fee));
                        fund.subWH = fund.subFee * this.rateWithHolding;
                        fund.subNetFee = fund.subFee - fund.subWH;

                        let fee = this.calculationSharing(transaction,fund.subNetFee,sharing,fund.incentive);
                        fund.wccSubFEF = fee.wccResult;
                        fund.subFrontEndFee = fee.rmResult;
                        fund.wccSharing = fee.wccSharing;
                        fund.rmSharing = fee.rmSharing;
                        // fund.wccSubFEF = fund.subNetFee * amcSharing.sharing;
                        // fund.subFrontEndFee = Math.floor(fund.wccSubFEF * sharing * inc);
                        // fund.wccSubFEF = fund.subNetFee * sharing;
                        // if(amc_name !=='PRINCIPAL'){
                        //     fund.subFrontEndFee = Math.floor(fund.wccSubFEF * 0.7);
                        // }else{
                        //     fund.subFrontEndFee = Math.floor(fund.wccSubFEF);
                        // }
                        

                    } else if (type === 'SWI') {
                        fund.swiAmount += Math.floor(this.string2Number(transaction.confirmed_amount));
                        fund.swiFee += Math.floor(this.string2Number(transaction.fee));
                        fund.swiWH = fund.swiFee * this.rateWithHolding;
                        fund.swiNetFee = fund.swiFee - fund.swiWH;

                        let fee = this.calculationSharing(transaction,fund.swiNetFee,sharing,fund.incentive);
                        fund.wccSwiFEF = fee.wccResult;
                        fund.swiFrontEndFee = fee.rmResult;
                        fund.wccSharing = fee.wccSharing;
                        fund.rmSharing = fee.rmSharing;
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
                
                }else if(status === "WAITING" && (type === 'SUB' || type === 'SWI')){
                    if(transaction.amount !== null){
                        fund.waitingAmount = parseFloat(transaction.amount.replace(/,/g, ''));
                    }
                }
            }
            
            // console.log( "no.:"+ (i++) +" ac:"+transaction.account_id+" fundCode:"+transaction.fund_code+" wccFee:"+fund.wccFronEndFee  );
        }

        for(let i=0;i<fundcodes.length;i++){
            grandTotalSubAmount += fundcodes[i].subAmount;
            grandTotalSubFontEndFee += fundcodes[i].subFrontEndFee;
            grandTotalSwiAmount += fundcodes[i].swiAmount;
            grandTotalSwiFontEndFee += fundcodes[i].swiFrontEndFee;
            grandTotalAmount += fundcodes[i].totalAmount;
            grandTotalFrontEndFee += fundcodes[i].totalFrontEndFee;
            grandTotalWCCFrontEndFee += fundcodes[i].wccFrontEndFee;
            grandWaitingAmount += fundcodes[i].waitingAmount;
        }
        this.performance = grandTotalFrontEndFee + this.trailingFee - this.target;
        if(this.performance <=0 ){
            this.performance = 0;
            this.rmPay4Sharing =0;
        }else{
            this.rmPay4Sharing = Math.floor(this.performance * this.incentive);
        }
        
        // let promotion = this.payPromotion.total_reward;
        const user = {
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
            'trailingFee':this.trailingFee,
            'profile': this.profile,
            'target':this.target,
            'incentive':this.incentive,
            'rmPay4Sharing':this.rmPay4Sharing,
            'performance':this.performance
        }
        this.frontEndFee = grandTotalFrontEndFee;

        // console.log("............................................................");
        // console.log(user);
        // console.log("............................................................");
        return this.detail= user;
    }

    public getDetail(){
        return this.detail;
    }
    
    public string2Number(str:string):number{
        if(str == null || str == ''){
            return 0;
        }
        return parseFloat(str.replace(/,/g, ''));
    }

    public gen(){
        const trans = this.getTransactionsByIC();
        return this.getFundCode(trans);
    }
    public getSharingByAmcCode(amcCode) {
        let result = this.backEndWccSharing.find(item => item.AMC === amcCode);
        return result ? result.sharing : null; 
    }

    public getValidateFreelancer(ic_code:string ,amcCode:string,transactionDate:string,sharing:number){

        const startDate = new Date('2024-01-31');
        let datePart = transactionDate.split(" ")[0];
        let parts = datePart.split("/");
        let date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const transaction_date = new Date(date);

        if(ic_code.indexOf('F') === 0){
            if(transaction_date > startDate){
                // sharing = this.getSharingByAmcCode(amcCode);
                if(amcCode ==='ASSETFUND' || amcCode ==='KTAM' || amcCode ==='EASTSPRING' || amcCode ==='KASSET'){
                    if(sharing == undefined || sharing == 0.7){
                        sharing = 1;
                    }
                }
            }
        }
        return sharing;
    }

    public calculationSharing(tran,netFee,fundCodeSharing,incentive){
        let ic_code = this.icCode;
        let wccSharing = 1;
        let rmSharing = 0;
        let wccResult = 0;
        let rmResult = 0;

        let tran_amc = tran.amc_code;
        const amc = ['KTAM','EASTSPRING','KASSET','ASSETFUND'];
        
        if(ic_code.indexOf('F') >= 0 ){   //
            if(amc.includes(tran_amc)){
                wccSharing = 1;
                rmSharing = incentive;
                wccResult = netFee * wccSharing;
                rmResult = wccResult * rmSharing;
            }else{
                wccSharing = fundCodeSharing;
                rmSharing = incentive;
                wccResult = netFee * wccSharing;
                rmResult = wccResult * rmSharing;
            }
        }else if(amc.includes(tran_amc) && ic_code.indexOf('F') < 0){   //เป็นพนักงานประจำและซื้อกองใน 4 บลจ 100
            wccSharing = 1;
            rmSharing = 0.7;
            wccResult = netFee * wccSharing;
            rmResult = wccResult * rmSharing;
        }else{  //เป็นพนักงานประจำและซื้อกองนอกเหนือ 4 บลจ 100
            wccSharing = fundCodeSharing;
            rmSharing = 1;
            wccResult = netFee * wccSharing;
            rmResult = wccResult * rmSharing;
        }
        return { 'wccResult':wccResult, 'rmResult':rmResult, 'wccSharing': wccSharing, 'rmSharing':rmSharing};
    }
}