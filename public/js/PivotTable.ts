class PivotTable {

    private datas: Array<any> = [];
    private table_id: string = "";
    private frontEndFee:number = 0;
    private backEndFee:number = 0;
    private grandTotalSumFrontEndFee =0;
    private offsetFee = 0; // ค่าชดเชย 10บาท
    private amcSharing: Array<any> = [];
    private jsonAllottment:Array<any> = [];
    private jsonWaitting:Array<any> = [];
    private jsonOther:Array<any> = [];
    private jsonSum:any;
    private permission:number = 0;
    private incentive:number = 1;
    private userProfile:any;
    private summaryFeeAll:number =0;

    private team:any =[];
    private backEndSharing:any = [
        {AMC:"KTAM",sharing:100},
        {AMC:"EASTSPRING",sharing:100},
        {AMC:"KASSET",sharing:100},
        {AMC:"ASSETFUND",sharing:100},
        {AMC:"PRINCIPAL",sharing:70},
        {AMC:"MFC",sharing:70},
        {AMC:"SCBAM",sharing:70},
        {AMC:"ONEAM",sharing:70},
        {AMC:"UOBAM",sharing:70},
        {AMC:"LHFUND",sharing:70},
        {AMC:"KSAM",sharing:70},
        {AMC:"KKPAM",sharing:80},
        {AMC:"ABERDEEN",sharing:80}
    ];

    constructor(id:string) {
        this.table_id = id;
     }
    
     public setTeam(team:[]){
        this.team = team;
     }

    public setPermission(permission:number){
        this.permission = permission;
    }

    public setData(datas: Array<any>): void {
        this.datas = datas;
    }

    public setTable(id: string) {
        this.table_id = id;
    }

    public setAMCSharing(ar:Array<any>){
        this.amcSharing = ar;
    }

    public setUserProfile(user:any){
        this.userProfile = user;
        if(user.ic_code.indexOf('F') === 0){  
            this.userProfile.type = 'F';
        }else{
            this.userProfile.type = 'P';
        }
    }

    public groupBy(array: Array<any>, key: string): any {
        let datas = array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
        return datas;
    }
    public filterData(array: Array<any>, key: string, values: string) {
        return array.filter(item => values.includes(item[key]));
    }

    public getFundCodes(array: Array<any>, key: string) {
        return Array.from(new Set(array.map(item => item[key]))).sort();
    }

    public setBackEndSharing():void{

    }

    public genFundTable(datas: Array<any>): void {
        // console.log("==================FunCode Table=========================");
        let json = this.groupBy(datas,"fund_code");
        // let fundKeys:string[] = Object.keys(json).sort((a:string, b:string) => {
        //     return b.localeCompare(a);
        //   });
        let fundKeys = Object.keys(json).sort();
        // console.log("this.table_id:"+this.table_id);
        let table:any = document.getElementById(this.table_id);
        // console.log(json);
        let sumAmountSWI:number = 0;
        let sumAmountSUB:number = 0;
        let sumFeeSWI:number = 0;
        let sumFeeSUB:number = 0;
        let sumWH_SUB:number = 0;
        let sumWH_SWI:number = 0;
        let grandAmount:number = 0;
        let grandFee:number =0;

        let grandFontEndFeeSUB:number = 0;
        let grandFontEndFeeSWI:number = 0;
        let grandBackEndFee:number = 0;

        for(let r=0;r < fundKeys.length; r++){
            let key:string = fundKeys[r];
            let data = json[key];
            
            let tranSUB:Array<string> = this.filterData(data,"transaction_type","SUB");
            let tranSWI:Array<string> = this.filterData(data,"transaction_type","SWI");

            let sellingFee:string = this.getPercentage(data[0].sharing);

            let totalAmountSUB:number = tranSUB.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.amount.replace(/,/g, '')), 0);
            // totalAmountSUB = Math.floor(totalAmountSUB);
            sumAmountSUB +=totalAmountSUB;

            let totalAmountSWI:number = tranSWI.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.amount.replace(/,/g, '')), 0);
            // totalAmountSWI = Math.floor(totalAmountSWI);
            sumAmountSWI +=totalAmountSWI;

            let totalFeeSUB:number = tranSUB.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.fee.replace(/,/g, '')), 0);
            // totalFeeSUB = Math.floor(totalFeeSUB);
            sumFeeSUB +=totalFeeSUB;

            let totalFeeSWI:number = tranSWI.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.fee.replace(/,/g, '')), 0);
            // totalFeeSWI = Math.floor(totalFeeSWI);
            sumFeeSWI += totalFeeSWI;

            let totalSumAmount =  totalAmountSUB+totalAmountSWI;
            grandAmount +=totalSumAmount;
            let totalSumFee =  totalFeeSUB+totalFeeSWI;
            grandFee += totalSumFee;

            let whSUB:number = totalFeeSUB * 0.03;
            sumWH_SUB += whSUB;
            let whSWI:number = totalFeeSWI * 0.03;
            sumWH_SWI += whSWI;

            let netSUB:number = this.netCalculate(totalFeeSUB,whSUB);
            let netSWI:number = this.netCalculate(totalFeeSWI,whSWI);

            let fontEndFeeSUB:number = netSUB*data[0].sharing;
            let fontEndFeeSWI:number = netSWI*data[0].sharing;
            grandFontEndFeeSUB +=fontEndFeeSUB;
            grandFontEndFeeSWI +=fontEndFeeSWI;

            const sharingAMC = this.backEndSharing.find(item => item.AMC === key);
            grandBackEndFee += (netSUB+netSWI) * sharingAMC;

            let row:any = table.insertRow(table.rows.length);
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            let cell5 = row.insertCell(5);
            let cell6 = row.insertCell(6);
            let cell7 = row.insertCell(7);
            let cell8 = row.insertCell(8);
            let cell9 = row.insertCell(9);
            let cell10 = row.insertCell(10);
            let cell11 = row.insertCell(11);
            let cell12 = row.insertCell(12);
            let cell13 = row.insertCell(13);
            let cell14 = row.insertCell(14);

            cell0.innerHTML = "<lable>"+key+"</lable>";

            cell1.style.textAlign = "left";
            cell1.innerHTML = this.getCurrency(totalAmountSUB);
            cell1.style.textAlign = "right";
            cell2.innerHTML = this.getCurrency(totalFeeSUB);
            cell2.style.textAlign = "right";
            //======= SUB WH =============
            cell3.innerHTML = this.getCurrency(whSUB);
            cell3.style.textAlign = "right";
            //======= SUB Net ============
            cell4.innerHTML = this.getCurrency(netSUB);
            cell4.style.textAlign = "right";
            
            cell5.innerHTML = sellingFee;
            cell5.style.textAlign = "right";
            cell6.innerHTML = this.getCurrency(fontEndFeeSUB);
            cell6.style.textAlign = "right";
            
            cell7.innerHTML = this.getCurrency(totalAmountSWI);
            cell7.style.textAlign = "right";
            cell8.innerHTML = this.getCurrency(totalFeeSWI);
            cell8.style.textAlign = "right";

            //+++++++++++++++++++++++++++++++++++++++++++++++++++ SWI +++++++++++++

            //======= SUB WH =============
            cell9.innerHTML = this.getCurrency(whSWI);
            cell9.style.textAlign = "right";
            //======= SUB Net ============
            cell10.innerHTML = this.getCurrency(netSWI);
            cell10.style.textAlign = "right";

            cell11.innerHTML = sellingFee;
            cell11.style.textAlign = "right";
            cell12.innerHTML = this.getCurrency(fontEndFeeSWI);
            cell12.style.textAlign = "right";

            //==== Total Sum of Amount
            cell13.innerHTML = this.getCurrency(totalSumAmount);
            cell13.style.textAlign = "right";
            //==== Total Sum of Fee
            cell14.innerHTML = this.getCurrency(totalSumFee);
            cell14.style.textAlign = "right";
        }

        let grandNetSUB:number = this.netCalculate(sumFeeSUB,sumWH_SUB);
        let grandNetSWI:number = this.netCalculate(sumFeeSWI,sumWH_SWI);

        let footer = table.createTFoot();
        let row = footer.insertRow(0);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);
        let cell5 = row.insertCell(5);
        let cell6 = row.insertCell(6);
        let cell7 = row.insertCell(7);
        let cell8 = row.insertCell(8);
        let cell9 = row.insertCell(9);
        let cell10 = row.insertCell(10);
        let cell11 = row.insertCell(11);
        let cell12 = row.insertCell(12);
        let cell13 = row.insertCell(13);
        let cell14 = row.insertCell(14);

        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SUB2 +++++++++++++
        cell1.innerHTML = "<b>"+this.getCurrency(sumAmountSUB)+"</b>";
        cell1.style.textAlign = "right";
        cell2.innerHTML = "<b>"+this.getCurrency(sumFeeSUB)+"</b>";
        cell2.style.textAlign = "right";
        //======= SUB WH =============
        cell3.innerHTML = "<b>"+this.getCurrency(sumWH_SUB)+"</b>";
        cell3.style.textAlign = "right";
        //======= SUB Net ============
        cell4.innerHTML = "<b>"+this.getCurrency(grandNetSUB)+"</b>";
        cell4.style.textAlign = "right";
        //==============  Selling fee ==========
        cell5.innerHTML = "";//this.getPercentage(data.selling_fee);
        cell5.style.textAlign = "right";
        //==============  Front End fee ==========
        cell6.innerHTML = "<b>"+this.getCurrency(grandFontEndFeeSUB)+"</b>";
        cell6.style.textAlign = "right";
        
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SWI +++++++++++++
        cell7.innerHTML = "<b>"+this.getCurrency(sumAmountSWI)+"</b>";
        cell7.style.textAlign = "right";
        cell8.innerHTML = "<b>"+this.getCurrency(sumFeeSWI)+"</b>";
        cell8.style.textAlign = "right";
        //======= SWI WH =============
        cell9.innerHTML = "<b>"+this.getCurrency(sumWH_SWI)+"</b>";
        cell9.style.textAlign = "right";
        //======= SWI Net ============
        cell10.innerHTML = "<b>"+this.getCurrency(grandNetSWI)+"</b>";
        cell10.style.textAlign = "right";
        
        //==============  Selling fee ==========
        cell11.innerHTML = "";
        cell11.style.textAlign = "right";
        //==============  Front End fee ==========
        cell12.innerHTML = "<b>"+this.getCurrency(grandFontEndFeeSWI)+"</b>";
        cell12.style.textAlign = "right";
        
        //==== Total Sum of Amount
        cell13.innerHTML = "<b>"+this.getCurrency(grandAmount)+"</b>";
        cell13.style.textAlign = "right";
        //==== Total Sum of Fee
        cell14.innerHTML = "<b>"+this.getCurrency(grandFee)+"</b>";
        cell14.style.textAlign = "right";
        
        this.frontEndFee = grandFontEndFeeSWI+grandFontEndFeeSUB;
        this.backEndFee = grandBackEndFee;
    }

    public genFundTableVer2(datas: Array<any>): void {
        // console.log("==================FunCode Table=========================");
        let json = this.groupBy(datas,"fund_code");
        let amc_code:string = '';

        let fundKeys = Object.keys(json).sort();

        let table:any = document.getElementById(this.table_id);

        let sumAmountSWI:number = 0;
        let sumAmountSUB:number = 0;
        let sumFeeSWI:number = 0;
        let sumFeeSUB:number = 0;
        let sumWH_SUB:number = 0;
        let sumWH_SWI:number = 0;
        let grandAmount:number = 0;
        let grandFee:number =0;

        let grandFontEndFeeSUB:number = 0;
        let grandFontEndFeeSWI:number = 0;
        let grandBackEndFee:number = 0;
        let grandTotalFontEndFee:number =0;

        this.jsonAllottment = [];

        for(let r=0;r < fundKeys.length; r++){
            let key:string = fundKeys[r];
            let data = json[key];
            amc_code = data[0].amc_code;
            
            let tranSUB:Array<string> = this.filterData(data,"transaction_type","SUB");
            let tranSWI:Array<string> = this.filterData(data,"transaction_type","SWI");

            // let sellingFee:string = this.getPercentage(data[0].sharing);
            
            let totalAmountSUB:number = tranSUB.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.confirmed_amount.replace(/,/g, '')), 0);
            sumAmountSUB +=totalAmountSUB;

            let totalAmountSWI:number = tranSWI.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.confirmed_amount.replace(/,/g, '')), 0);
            sumAmountSWI +=totalAmountSWI;

            let totalFeeSUB:number = tranSUB.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.fee.replace(/,/g, '')), 0);
            sumFeeSUB +=totalFeeSUB;

            let totalFeeSWI:number = tranSWI.reduce((accumulator:number, currentItem:any) => accumulator + parseFloat(currentItem.fee.replace(/,/g, '')), 0);
            sumFeeSWI += totalFeeSWI;

            let totalSumAmount =  totalAmountSUB+totalAmountSWI;
            grandAmount +=totalSumAmount;
            let totalSumFee =  totalFeeSUB+totalFeeSWI;
            grandFee += totalSumFee;

            let whSUB:number = totalFeeSUB * 0.03;
            sumWH_SUB += whSUB;
            let whSWI:number = totalFeeSWI * 0.03;
            sumWH_SWI += whSWI;

            let netSUB:number = this.netCalculate(totalFeeSUB,whSUB);
            let netSWI:number = this.netCalculate(totalFeeSWI,whSWI);
            this.summaryFeeAll = sumFeeSUB+ sumFeeSWI;

            let sharingAMC = this.backEndSharing.find(item => item.AMC === amc_code);
            if(sharingAMC === undefined){
                sharingAMC = 100;
            }
            grandBackEndFee += (netSUB+netSWI) * sharingAMC.sharing/100;
            // console.log(this.summaryFeeAll);
            // === Validate ค่า sharing =================================================            
            let sharing = data[0].sharing;
            if(sharing == null){
                // sharing = 1;
                sharing = 0.7;
            }
            let filteredData = this.amcSharing.filter(item => item.fund_code === data[0].fund_code);
            if(filteredData.length>0){
                let s = filteredData[0];
                if(data.length > 0){
                    let amc_date = new Date(s.promotion_start_date);
                    // let dateString  = new Date(data[0].transaction_date);
                    const [datePart] = data[0].transaction_date.split(" "); // เอาเฉพาะส่วนของวันที่ (27/03/04)
                    const [day, month, year] = datePart.split("/");
                    const transaction_date = new Date(`${year}-${month}-${day}`);
                    if(amc_date <= transaction_date ){
                        if(s.sharing !== undefined)
                            sharing = parseFloat(s.sharing);
                    }                    
                }
            }
            // === Validate ค่า sharing * สำหรับบุคคลที่เป็น Freelancer =====================
            // ASSETFUND , KTAM  and transaction date > 2024-02-01
            if(data.length>0){
                sharing = this.getValidateFreelancer(data[0].ic, data[0].amc_code, data[0].transaction_date, sharing);
            }else if(filteredData.length >0){
                sharing = this.getValidateFreelancer(filteredData[0].ic, filteredData[0].amc_code, filteredData[0].transaction_date, sharing);
            }

            //================= เพิ่ม ตัวทดในการลดเพื่อ Error ===============================
            let fontEndFeeSUB:number = Math.floor(netSUB*sharing);
            if(fontEndFeeSUB > 10){
                // fontEndFeeSUB = fontEndFeeSUB - this.offsetFee;
                fontEndFeeSUB = Math.floor((fontEndFeeSUB - this.offsetFee) * this.incentive);
            }else if(fontEndFeeSUB >0 && fontEndFeeSUB <= 10){
                fontEndFeeSUB =0;
            }


            let fontEndFeeSWI:number = Math.floor(netSWI*sharing);
            if(fontEndFeeSWI > 10){
                // fontEndFeeSWI = fontEndFeeSWI - this.offsetFee;
                fontEndFeeSWI =Math.floor( (fontEndFeeSWI - this.offsetFee) * this.incentive);
            }else if(fontEndFeeSWI >0 && fontEndFeeSWI <= 10){
                fontEndFeeSWI =0;
            }

            let totalFontEndFee:number = fontEndFeeSUB+fontEndFeeSWI;
            
            grandFontEndFeeSUB +=fontEndFeeSUB;
            grandFontEndFeeSWI +=fontEndFeeSWI;
            grandTotalFontEndFee += totalFontEndFee;

            let row:any = table.insertRow(table.rows.length);
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);

            let cell6 = row.insertCell(2);
            let cell7 = row.insertCell(3);
            let cell12 = row.insertCell(4);
            let cell13 = row.insertCell(5);
            let cell14 = row.insertCell(6);

            cell0.innerHTML = "<lable>"+key+"</lable>";
            let j:Record<any, any> = {"fundcode":key};

            cell1.style.textAlign = "left";
            cell1.innerHTML = this.getCurrency(totalAmountSUB);
            cell1.style.textAlign = "right";

            if(this.permission !== undefined){
                
                if(this.permission ===3 || this.permission === 5){
                    let text = '';
                    // if(this.userProfile.type ==='P'){
                        text += 'sharing = '+(sharing*100)+'%';
                    // }
                    
                    if(this.incentive == 0.75){
                        text += '  incentive= 75%'
                    }else if(this.incentive > 0){
                        text += '  incentive= '+(this.incentive*100)+'%'
                    }
                    cell6.innerHTML = "<a title='"+text+"' href='#'>"+this.getCurrency(fontEndFeeSUB)+"</a>";    
                }
            }else{
                cell6.innerHTML = this.getCurrency(fontEndFeeSUB);  
            }
            
            cell6.style.textAlign = "right";
            
            cell7.innerHTML = this.getCurrency(totalAmountSWI);
            cell7.style.textAlign = "right";

            if(this.permission !== undefined){
                if(this.permission ===3 || this.permission === 5){
                    let text = '';
                    // if(this.userProfile.type ==='P'){
                        text += 'sharing = '+(sharing*100)+'%';
                    // }
                    
                    if(this.incentive == 0.75){
                        text += '  incentive= 75%'
                    }else if(this.incentive > 0){
                        text += '  incentive= '+(this.incentive*100)+'%'

                    }
                    cell12.innerHTML = "<a title='"+text+"' href='#'>"+this.getCurrency(fontEndFeeSWI)+"</a>";
                }
                    
            }else{
                cell12.innerHTML = this.getCurrency(fontEndFeeSWI);
            }
            
            cell12.style.textAlign = "right";
            if(totalAmountSUB > 0){
                j.SUB = {"amount":this.getCurrency(totalAmountSUB),"FEFee":this.getCurrency(fontEndFeeSUB)};
            }
            if(totalAmountSWI > 0){
                j.SWI = {"amount":this.getCurrency(totalAmountSWI),"FEFee":this.getCurrency(fontEndFeeSWI)};
            }

            //==== Total Sum of Amount
            cell13.innerHTML = this.getCurrency(totalSumAmount);
            cell13.style.textAlign = "right";
            //==== Total Sum of Fee
            cell14.innerHTML = this.getCurrency(totalFontEndFee);
            cell14.style.textAlign = "right";

            j.total_amount = this.getCurrency(totalSumAmount);
            j.total_FEFee = this.getCurrency(totalFontEndFee);

            this.jsonAllottment.push(j);
            // console.log(this.jsonAllottment);
        }
        
        let grandNetSUB:number = this.netCalculate(sumFeeSUB,sumWH_SUB);
        let grandNetSWI:number = this.netCalculate(sumFeeSWI,sumWH_SWI);

        let footer = table.createTFoot();
        let row = footer.insertRow(0);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell6 = row.insertCell(2);
        let cell7 = row.insertCell(3);
        let cell12 = row.insertCell(4);
        let cell13 = row.insertCell(5);
        let cell14 = row.insertCell(6);

        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SUB +++++++++++++
        let sumAmountSUB_s = this.getCurrency(sumAmountSUB);
        cell1.innerHTML = "<b>"+sumAmountSUB_s+"</b>";
        cell1.style.textAlign = "right";

        //==============  Front End fee SUB==========
        let sumFEFeeSUB_s = this.getCurrency(grandFontEndFeeSUB);
        cell6.innerHTML = "<b>"+sumFEFeeSUB_s+"</b>";
        cell6.style.textAlign = "right";
        
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ SWI +++++++++++++
        let sumAmountSWI_s = this.getCurrency(sumAmountSWI);
        cell7.innerHTML = "<b>"+sumAmountSWI_s+"</b>";
        cell7.style.textAlign = "right";

        //==============  Front End fee SWI==========
        let sumFEFeeSWI_s = this.getCurrency(grandFontEndFeeSWI);
        cell12.innerHTML = "<b>"+sumFEFeeSWI_s+"</b>";
        cell12.style.textAlign = "right";
        
        //==== Total Sum of Amount
        let sumAmount_s = this.getCurrency(grandAmount);
        cell13.innerHTML = "<b>"+sumAmount_s+"</b>";
        cell13.style.textAlign = "right";
        //==== Total Sum of Fee
        let sumFEFee_s = this.getCurrency(grandTotalFontEndFee);
        cell14.innerHTML = "<b>"+sumFEFee_s+"</b>";
        cell14.style.textAlign = "right";
        
        this.frontEndFee = grandFontEndFeeSWI+grandFontEndFeeSUB;
        this.grandTotalSumFrontEndFee = grandFontEndFeeSWI+grandFontEndFeeSUB;
        this.backEndFee = grandBackEndFee;

        this.jsonSum = {
            "sumAmountSUB":sumAmountSUB_s,
            "sumFEFeeSUB":sumFEFeeSUB_s,
            "sumAmountSWI":sumAmountSWI_s,
            "sumFEFeeSWI":sumFEFeeSWI_s,
            "sumAmount":sumAmount_s,
            "sumFEFee":sumFEFee_s,
            "sumaryFEE_All":this.summaryFeeAll,
            "grandBackEndFee":grandBackEndFee
        }
    }

    public getCurrency(val:number):string{
        if(val !==0){
            // val = Math.floor(val);
            const currencyValue:string = new Intl.NumberFormat('th-TH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(val);
            return this.antiNaN(currencyValue);
        }else{
            return "";
        }
    }
    public antiNaN(value:any):string{
        if(value === "NaN"){
            return "";
        }
        return ""+value;
    }

    public removeRows():void {
        //console.log("remove rows------------");
        let table:any = document.getElementById(this.table_id);
        if(table.rows.length > 2){
            for (let i = table.rows.length; i > 2; i--) {
                table.deleteRow(2);
            }
        }   
    }

    public netCalculate(fee:number,wh:number):number{
        let net = fee - wh;
        return net;
    }

    public getPercentage(data:number):string{
        if(data ===null){
            return "0 %";
        }
        return (data*100)+" %";
    }

    public getFrontEndFee():number{
        // console.log("--------------------------------------------------------");
        // console.log(this.frontEndFee);
        return this.frontEndFee;
    }
    public getgrandTotalSumFrontEndFee():number{
        return this.grandTotalSumFrontEndFee;
    }
    
    public getAllottment(){
        return this.jsonAllottment;
    }
    
    public getSum(){
        return this.jsonSum;
    }
    public getSumaryAllFee(){
        return this.summaryFeeAll;
    }
    public getSumaryAllFeeStr(){
        return this.getCurrency(this.summaryFeeAll);
    }
    public getBackEndFee(){
        return this.backEndFee;
    }
    public getBackEndFeeStr(){
        return  this.getCurrency(this.backEndFee);
    }
    
    public test():void{
        console.log("==================FunCode Table=========================");
    }
    
    // === Validate ค่า sharing * สำหรับบุคคลที่เป็น Freelancer =====================            
    // ASSETFUND , KTAM  and transaction date > 2024-02-01
    public getValidateFreelancer(ic_code:string ,amcCode:string,transactionDate:string,sharing:number){

        const startDate = new Date('2024-01-31');
        let datePart = transactionDate.split(" ")[0];
        let parts = datePart.split("/");
        let date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const transaction_date = new Date(date);

        if(ic_code.indexOf('F') === 0){            
            if(transaction_date > startDate){
                if(this.userProfile){
                    if(this.userProfile.incentive !== undefined || this.userProfile.incentive !== null){
                        let ins = this.userProfile.incentive;
                        if(this.userProfile.incentive !== undefined){
                            this.incentive = ins[0].incentive;
                        }else{
                            this.incentive = 0.75;    
                        }
                    }else{
                        this.incentive = 0.75;
                    }
                }else{
                    this.incentive = 0.75;
                }
                
                
                this.offsetFee = 0;                                             // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM Freelancer

                /** จากการประชุมวันที่ 30/09/2024 ยกเลิกการคำนวน sharing สำหรับ Freelancer */

                // if(amcCode ==='ASSETFUND' || amcCode ==='KTAM' || amcCode ==='KASSET'){
                    if(sharing === undefined || sharing === 0.7){
                        sharing = 1;
                    }
                // }
            }
        }else{
            this.incentive = 1;
            // this.offsetFee = 10;                                                // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM ทั่วไป
        }
        return sharing;
    }
    public getTotalFee(array: Array<any>, key: string) {
        return Array.from(new Set(array.map(item => item[key]))).sort();
    }
}

