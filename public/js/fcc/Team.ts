class Team{
    private team_id:string;
    private team_code:string;
    private team_name:string;
    private member:Array<string>;
    private DATAS:any;
    private target:any;
    private salary:any;
    private incentive:any;
    private trailingFee:Array<any> = [];
    private wccTrailingFee:number;
    private rmTrailingFee:number;
    private salaryTeam:number =0;
    private targetTeam:number =0;
    private trailingTeam:number =0;

    private trasactions:any;
    private sharing:any;
    private team: Array<any> =[];
    
    private profile:any;
    private sumPaySharing:number = 0;
    private payPromotion:number =0;
    private wccPromotion:number =0;
    private totalAUM:number =0;
    

    private grandTotalSubAmount:number = 0;
    private grandTotalSubFrontEndFee:number = 0;
    private grandTotalSwiAmount:number = 0;
    private grandTotalSwiFrontEndFee:number = 0;
    private grandTotalAmount:number = 0;
    private grandTotalFrontEndFee:number = 0;
    private grandTotalWCCFrontEndFee:number = 0;
    private fundCodeTeam:Array<any> = [];
    private wccSumPromotion:number =0;

    constructor(DATAS){
        this.DATAS = DATAS;
        this.team_id = DATAS.team.team_id;
        this.team_code = DATAS.team.name;
        this.team_name = DATAS.team.remark;
        this.profile = DATAS.team;
        this.trailingFee = DATAS.trailing;
        this.incentive = DATAS.incentive;

        let ans = DATAS.team.member;
        if(ans !== undefined){
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

    public getTargetByIC(ic_code){
        const objTarget = this.target.find(item => item.ic_code === ic_code);
        if(objTarget == undefined){
            return 0;
        }
        return objTarget.target;
    }
    public getIncentiveByIC(ic_code){
        const objIncentive = this.incentive.find(item => item.ic_code === ic_code);
        return objIncentive.incentive;
    }

    public getSalary(){
        let salary = this.DATAS.salary[0].base_salary;
        this.salary = parseInt(salary);
        return this.salary;
    }

    public getSalaryTeam(){
        let members = this.member;
        let salarys = this.DATAS.salary;
        let sumSalary = 0;
        // console.log(this.DATAS);
        for(let i=0;i< members.length;i++ ){
            let member = members[i];
            let salary = salarys.find(item => item.employee_id == member);
            sumSalary += parseInt(salary.base_salary);
        }
        return sumSalary;
    }
    public getTargetTeam(){
        let members = this.member;
        let targets = this.DATAS.target;
        let sumTarget =0;
        for(let i=0;i< members.length;i++ ){
            let member = members[i];
            let target = targets.find(item => item.ic_code == member);
            sumTarget += parseInt(target.target);
        }
    }
    public getValueTeam(){
        let members = this.member;
        let targets = this.DATAS.target;
        let salarys = this.DATAS.salary;
        let trailings = this.DATAS.trailing;
        let AUMs = this.DATAS.AUM;
        

        let sumTarget = 0;
        let sumSalary = 0;
        let sumTrailing = 0;
        let sumTrailingWCC = 0;
        let sumAUM = 0;
        for(let i=0;i< members.length;i++ ){
            let member = members[i];
            let target = targets.find(item => item.ic_code == member);
            let salary = salarys.find(item => item.employee_id == member);
            let trailing = trailings.find(item => item.employee_id == member);
            let AUM = AUMs.find(item => item.IC == member);
            
            sumTarget += parseInt(target.target);
            sumSalary += parseInt(salary.base_salary);
            if(trailing != undefined){
                sumTrailing += parseInt(trailing.rmTrailingFee);
                sumTrailingWCC += parseInt(trailing.wccTrailingFee);
            }
            if(AUM != undefined){
                sumAUM += parseInt(AUM.TotalOutstandingBalanceAmount);
            }
        }
        this.salaryTeam = sumSalary;
        this.targetTeam = sumTarget;
        this.trailingTeam =sumTrailing;
        this.wccTrailingFee = sumTrailingWCC;
        this.totalAUM = sumAUM;
        return [sumSalary,sumTarget,sumTrailing,sumTrailingWCC,sumAUM];
    }

    public getMember(){
        return this.member;
    }
    public getTransactions(){
        return this.trasactions;
    }
    public convertToJSON(input) {
        // ปรับโครงสร้างข้อความให้เป็น JSON ที่ถูกต้อง
        let corrected = input
            .replace("{", '{"')
            .replace(":", '":')
            .replace("[", '[')
            .replace("]", ']')
            .replace("}", '}');
        
        try {
            // แปลงข้อความเป็น JSON object
            return JSON.parse(corrected);
        } catch (error) {
            console.error("Error decoding JSON:", error);
            return null; // คืนค่า null หากแปลงไม่สำเร็จ
        }
    }
    public addMember(u:any){
        this.team.push(u);
    }
    public getTeam(){
        return this.team;
    }
    public getData(){
        const [salary,targetTeam,trailingTeam,wccTrailingTeam,AUM] = this.getValueTeam();
        const totalIcentive = salary + this.sumPaySharing + this.payPromotion;
        const obj = {
            team_id: this.team_id,
            teamName:this.team_name,
            member: this.member,
            team: this.team,
            target: targetTeam,
            salary: salary,
            incentive: this.incentive,
            trailing:this.trailingFee,
            rmTrailingFee: trailingTeam,
            wccTrailingFee: wccTrailingTeam,
            sharing: this.sharing,
            rmPromotion:this.payPromotion,
            wccPromotion:this.wccPromotion,
            totalAUM:AUM,
            '1grandTotalSubAmount': this.grandTotalSubAmount,
            '2grandTotalSubFontEndFee': this.grandTotalSubFrontEndFee,
            '3grandTotalSwiAmount': this.grandTotalSwiAmount,
            '4grandTotalSwiFontEndFee': this.grandTotalSwiFrontEndFee,
            '5grandTotalAmount': this.grandTotalAmount,
            '6grandTotalFrontEndFee': this.grandTotalFrontEndFee,
            '7grandTotalWCCFrontEndFee': this.grandTotalWCCFrontEndFee,
            'fundCodeTeam': this.fundCodeTeam,
            'sumPaySharing':this.sumPaySharing,
            totalIcentive:totalIcentive
        }
        return obj;
    }


    public getTarget(){
        const objTarget = this.target.find(item => item.ic_code === this.team_code);
        return objTarget.target;
    }
    public getTrailingByIC(ic_code){
        const objTrailing = this.trailingFee.find(item => item.employee_id === ic_code);
        if(objTrailing != undefined){
            this.rmTrailingFee = objTrailing.rmTrailingFee;
            this.wccTrailingFee = objTrailing.wccTrailingFee;    
        }else{
            this.rmTrailingFee = 0;
            this.wccTrailingFee = 0;
        }
        
        return this.rmTrailingFee;
    }

    public mergeTransactions(){
        for(let i=0;i<this.team.length;i++){
            let member = this.team[i];
            this.grandTotalSubAmount += member['1grandTotalSubAmount'];
            this.grandTotalSubFrontEndFee += member['2grandTotalSubFontEndFee'];
            this.grandTotalSwiAmount += member['3grandTotalSwiAmount'];
            this.grandTotalSwiFrontEndFee += member['4grandTotalSwiFontEndFee'];
            this.grandTotalAmount += member['5grandTotalAmount'];
            this.grandTotalFrontEndFee += member['6grandTotalFrontEndFee']; 
            this.grandTotalWCCFrontEndFee += member['7grandTotalWCCFrontEndFee'];
            this.sumPaySharing += member.rmPay4Sharing;
            if(member.payPromotion !== undefined){
                this.payPromotion += member.payPromotion.total_reward;
                this.wccPromotion += member.payPromotion.feeAfterWithholdingTaxAndSharing;
            }
            
            let funds = member.fund_codes;
            if(i ==0){
                // fundCodeTeam = funds
                this.fundCodeTeam = Array.from(funds);
            }else{
                console.log(funds);
                for(let j=0;j<funds.length;j++){
                    let fund = funds[j];
                    let fund_code = fund.fundcode;

                    const target = this.fundCodeTeam.find(item => item.fundcode === fund_code);
                    if(target){
                        target.subAmount += fund.subAmount;
                        target.subFrontEndFee += fund.subFrontEndFee;
                        target.swiAmount += fund.swiAmount;
                        target.swiFrontEndFee += fund.swiFrontEndFee;
                        target.totalAmount += fund.totalAmount;
                        target.totalFrontEndFee += fund.totalFrontEndFee;
                        target.wccFronEndFee += fund.wccFronEndFee;
                    }else{
                        this.fundCodeTeam.push(fund);
                    }
                }
            }
        }
        // console.log(this.fundCodeTeam);
    }
}