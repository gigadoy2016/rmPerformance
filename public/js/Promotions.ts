class Promotions{
    private name:string = '';
    private ic:string = '';
    private datas:Array<any>;
    private AMC_Sharing100:Array<string> = ["KTAM","EASTSPRING","KASSET","ASSETFUND"];
    private sharingRate:number = 0.7;
    private performnace = 0;
    // private amcSharing:any;

    constructor(ic:string, datas:Array<any>) {
        this.ic = ic;
        this.datas = datas;
    }
    private step_0(rows):Array<any>{
        //แยกข้อมูลที่เป็น SWI SUB และที่มีค่า FEE

        const group:Array<any> = [];
        for(let i=0; i< rows.length ;i++){
            let row:any = rows[i];
            let fee:number = 0;
            if(row.fee !== undefined && row.fee !== null){
                fee = parseFloat(row.fee.replace(/,/g, ''));
            }
            if( fee > 0){
                group.push(row);
            }
        }
        return group;
    }
    
    private step_1(rows):any{
        // จัดกลุ่ม Transaction ให้อยู่ใน บลจ ที่ sharing 100 
        const sharing_100:Array<any> = [];
        const sharing_70:Array<any> = [];

        for(let i=0; i < rows.length; i++ ){
            let row = rows[i];
            let amc_code = row.amc_code;
            
            // ตรวจสอบว่าค่า amc_code อยู่ใน AMC_Sharing100 หรือไม่
            let isSharing100 = false;
            for(let j=0; j < this.AMC_Sharing100.length; j++){
                if(amc_code == this.AMC_Sharing100[j]){
                    isSharing100 = true;
                    break; // หยุด loop เมื่อเจอ match
                }
            }
            // ถ้าอยู่ใน AMC_Sharing100 ให้ใส่ sharing_100
            if (isSharing100) {
                sharing_100.push(row);
            } else {
                // ถ้าไม่อยู่ใน AMC_Sharing100 ให้ใส่ sharing_70
                sharing_70.push(row);
            }
        }
        return {'sharing100':sharing_100, 'sharing70':sharing_70 };
    }

    private step_2(rows):any{
        // console.log(rows);
        // console.log(this.amcSharing);
        let sumAmount_150:number = 0;
        let sumAmount_125:number = 0;
        let sumAmount_Other:number = 0;

        let sumFee_150:number = 0;
        let sumFee_125:number = 0;
        let sumWithHoldingTax:number = 0;
        let feeAfterWithholdingTax:number = 0;
        let feeAfterWithholdingTaxAndSharing:number = 0;
        let wccWH125 = 0;
        let wccWH150 = 0;

        const Fee_125:Array<any> = [];
        const Fee_150:Array<any> = [];
        const Fee_Other:Array<any> = [];

        for(let i=0 ; i < rows.length; i++ ){
            let row:any = rows[i];
            let fee:number = parseFloat(row.fee.replace(/,/g, ''));
            let amount:number = parseFloat(row.confirmed_amount.replace(/,/g, ''));
            let fee_rate = fee/amount*100;
            let withHoldingTax = fee * 0.03;
            

            if(fee_rate >= 1.15  && fee_rate <= 1.20){
                sumAmount_125 += amount;
                sumFee_125 += fee;
                wccWH125 += withHoldingTax;
                Fee_125.push(row);
            }else if(fee_rate >= 1.37  && fee_rate <= 1.55){
                sumAmount_150 += amount;
                sumFee_150 += fee;
                wccWH150 += withHoldingTax;
                Fee_150.push(row);
            }else{
                sumAmount_Other += amount;
                Fee_Other.push(row);
            }
            sumWithHoldingTax +=  wccWH125 + wccWH150 ;
            // const sharing = this.amcSharing.find(item => item.fund_code === row.fund_code)?.sharing ||1;
            feeAfterWithholdingTax += (fee - withHoldingTax);
        }
        feeAfterWithholdingTaxAndSharing = feeAfterWithholdingTax *0.3;
        let reward_125 =Math.floor(sumAmount_125/1000000) *2500;
        let reward_150 =Math.floor(sumAmount_150/1000000) *3500;

        let rate:any ={
            'sumAmount_150' : sumAmount_150,
            'sumAmount_125' : sumAmount_125,
            'sumAmount_Other' : sumAmount_Other,
            'sumFee125':sumFee_125,
            'sumFee150':sumFee_150,
            'reward_125' : reward_125,
            'reward_150' : reward_150,
            'total_reward' : (reward_125+reward_150),
            'feeAfterWithholdingTax' : feeAfterWithholdingTax,
            'feeAfterWithholdingTaxAndSharing' :feeAfterWithholdingTaxAndSharing
        };
        if(this.performnace <= 0){
            rate.total_reward = 0;
        }
        return rate;
    }
    // สำหรับ Promotion Other นอกเหนือจาก 4 บลจ sharing 70%
    private step_3(rows){
        let sumAmount:number = 0;
        let sumFee:number = 0;
        let sumWithHoldingTax:number = 0;
        let feeAfterWithholdingTax:number = 0;
        let feeAfterWithholdingTaxAndSharing:number = 0;

        for(let i= 0;i < rows.length;i++){
            let row:any = rows[i];
            let fee:number = parseFloat(row.fee.replace(/,/g, ''));
            let amount:number = parseFloat(row.confirmed_amount.replace(/,/g, ''));

            let withHoldingTax:number = fee * 0.03;
            sumAmount += amount;
            sumFee += fee;
            sumWithHoldingTax += withHoldingTax;
        }
        feeAfterWithholdingTax = sumFee - sumWithHoldingTax;
        feeAfterWithholdingTaxAndSharing = feeAfterWithholdingTax * 0.7;
        return feeAfterWithholdingTaxAndSharing;
    }

    public setUserPerformance(perf){
        this.performnace = perf;
    }

    public getPromotion(){
        let step_0 = this.step_0(this.datas);
        let step_1 = this.step_1(step_0);
        let step_2 = this.step_2(step_1.sharing100);
        step_2.revenue = step_2.feeAfterWithholdingTax + this.step_3(step_1.sharing70);
        return step_2;
    }
}
