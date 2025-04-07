interface user4Excel{
    ic:string;
    name:string;
    target:number;
    totalFee:number;
    amountWaiting:number; 
}
class RMTable{
    private DATAs: Array<any> = [];
    private amcSharing:Array<any> = [];
    private table_id: string ="";
    private offsetFee = 10; // ค่าชดเชย 10บาท
    private jsonArray:Array<user4Excel>=[];
    private incentive:number = 1;
    private userProfile:any;
    private incentives:Array<any>;

    constructor(id:string) {
        this.table_id = id;
    } 

    public setOffsetFee(offset:number):void{
        this.offsetFee = offset;
    }

    public setTableID(id:string):void{
        this.table_id = id;
    }

    public setDatas(datas:Array<any>):void{
        this.DATAs = datas;
    }
    public setSharing(sharing:Array<any>):void{
        this.amcSharing = sharing;
    }
    public setUserProfile(user:any){
        this.userProfile = user;
    }

    public sort(datas:Array<any>,key:string):Array<any>{
        return datas.sort((a,b) => a[key] - b[key])
    }
    public groupBy(array: Array<any>, key: string): any {
        let datas = array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
        return datas;
    }

    private getTotalFee(transactions:Array<any>):any{
        let fundCode = this.groupBy(transactions,"fund_code");
        let fundKeys = Object.keys(fundCode).sort();
        let employee_id = "";

        const user = {
            'totalAmount':0,
            'totalFee':0,
            'fontEndFee':0,
            'waitingAmount':0
        }

        for(let i=0;i < fundKeys.length; i++){
            let key:string = fundKeys[i];
            let datas = fundCode[key];
            let sharing = 0.7;
            let cAmountTotal = 0;
            let feeTotal = 0;
            let sumFeeSUB= 0;
            let sumFeeSWI= 0;
            let waitingAmount = 0;
            // console.log(datas);

            let filteredData = this.amcSharing.filter(item => item.fund_code === datas[0].fund_code);

            for(let j=0; j < datas.length; j++){
                const data = datas[j];
                // console.log(">>"+data.ic);

                if(data.status === "ALLOTTED"){
                    employee_id = data.ic;
                    if(data.sharing !== null){
                        sharing = data.sharing;
                    }else{
                        sharing = 0.7;
                    }

                    if(filteredData.length>0){
                        sharing = filteredData[0].sharing;                        
                    }
                    sharing = this.getValidateFreelancer(data.ic,data.amc_code,data.transaction_date,sharing);
                    
                    if(data.confirmed_amount !== null){
                        let confirmed_amount = parseFloat(data.confirmed_amount.replace(/,/g, ''));
                        cAmountTotal += confirmed_amount;
                    }
                    if(data.fee !== null){
                        let fee = parseFloat(data.fee.replace(/,/g, ''));
                        if(data.transaction_type == "SUB"){
                            sumFeeSUB += fee;
                        }else if(data.transaction_type == "SWI"){
                            sumFeeSWI += fee;
                        }                        
                        // feeTotal += fee;
                        // user.totalFee += fee;
                    }
                }else if(data.status === "WAITING"){
                    if(data.amount !== null){
                        waitingAmount += parseFloat(data.amount.replace(/,/g, ''));
                    }
                }
            }

            let netSUB = this.getNet(sumFeeSUB)* sharing;
            let netSWI = this.getNet(sumFeeSWI)* sharing;
            
            //================= เพิ่ม ตัวทดในการลดเพื่อ Error ===============================
            
            let fontEndFeeSUB:number = Math.floor(netSUB);
            let fontEndFeeSWI:number = Math.floor(netSWI);
            if(fontEndFeeSUB > this.offsetFee){
                // fontEndFeeSUB = fontEndFeeSUB - this.offsetFee;
                fontEndFeeSUB = Math.floor((fontEndFeeSUB - this.offsetFee) * this.incentive);
            }else if(fontEndFeeSUB >0 && fontEndFeeSUB <= this.offsetFee){
                fontEndFeeSUB = 0;
            }
            if(fontEndFeeSWI > this.offsetFee){
                // fontEndFeeSWI = fontEndFeeSWI - this.offsetFee;
                fontEndFeeSWI =Math.floor( (fontEndFeeSWI - this.offsetFee) * this.incentive);
            }else if(fontEndFeeSWI >0 && fontEndFeeSWI <= this.offsetFee){
                fontEndFeeSWI = 0;
            }

            let fontEndFee = fontEndFeeSUB+fontEndFeeSWI;
            
            user.totalAmount += cAmountTotal;
            user.fontEndFee += fontEndFee;
            user.totalFee += feeTotal;
            user.waitingAmount += waitingAmount;
        }

        return user;
    }
    public filterData(array: Array<any>, key: string, values: string) {
        return array.filter(item => values.includes(item[key]));
    }
    private getNet(fee:number):number{
        let wh = fee * 0.03;
        let net = fee - wh;
        return net;
    }

    private latestUpdatedData(data:Array<any>){
        if(data.length > 0){
            return data.reduce((acc, obj) => {
                const currentDate = new Date(obj.updated);
                const latestDate = new Date(acc.updated);
                if (currentDate > latestDate) {
                  return obj;
                }
                return acc;
            });
        }else{
            return data;
        }
    }
    private getTarget(data:Array<any>){
        return data.reduce((acc, obj) => {
            const currentDate = new Date(obj.month_active);
            const latestDate = new Date(acc.month_active);
            if (currentDate > latestDate) {
              return obj;
            }
            return acc;
        });
    }


    public genListTable(datas:any):void{
        const table:any = document.getElementById(this.table_id);
        const users:Array<any> = datas.users;
        this.incentives = datas.incentives;
        this.amcSharing = datas.amc;    
        const AMC:Array<any> = datas.amc;
        this.jsonArray = [];

        for(let i=0; i < users.length; i++){
            const lastRow = table.rows.length;
            const user = users[i];
            // console.log(user);
            const trailingFee = this.latestUpdatedData(user.trailingFee);
            
            // console.log("trailingFee>>>");
            const row:any = table.insertRow(lastRow);
            const cell0 = row.insertCell(0);
            const cell1 = row.insertCell(1);
            const cell2 = row.insertCell(2);
            const cell3 = row.insertCell(3);
            const cell4 = row.insertCell(4);
            // const cell5 = row.insertCell(5);

            cell0.innerHTML = "<lable> "+user.ic_code+"</lable>";
            cell1.innerHTML = "<lable>"+user.name_th+" "+user.lastname_th+"</lable>";

            let obj = this.getTotalFee(user.transactions);
            const total_fee = trailingFee.trailing_fee + obj.fontEndFee;

            // console.log(user.ic_code+":"+obj.waitingAmount);
            let target;
            if(user.target.length > 0)
                target = this.getTarget(user.target);
            else{
                target = {target:user.d_target};
            }

            let labelTotalFee = "";
            if(total_fee > 0)
                labelTotalFee = Math.floor(total_fee).toLocaleString('en-US');

            let performance = obj.fontEndFee + trailingFee.trailing_fee - target.target;
            let labelPerformance = Math.floor(performance).toLocaleString('en-US');
            let labelFontEndFee = "";
            if(obj.fontEndFee > 0)
                labelFontEndFee = Math.floor(obj.fontEndFee).toLocaleString('en-US');
            let empIc = 'emp-'+user.ic_code;

            let labelTarget:number = 0;
            if(target.target != undefined){
                let txt:string = target.target;
                labelTarget = parseInt(txt);
            }
            
            cell2.innerHTML = Math.floor(labelTarget).toLocaleString('en-US');
            cell2.style.textAlign = "right";
            cell3.innerHTML = labelTotalFee;
            cell3.style.textAlign = "right";
            // cell4.innerHTML = labelFontEndFee;
            cell4.innerHTML = this.setGagueBar(empIc);
            let labelAmount = "";
            if(obj.waitingAmount > 0){
                labelAmount = Math.floor(obj.waitingAmount).toLocaleString('en-US');
            }
            // cell5.innerHTML = labelAmount;
            // cell5.style.textAlign = "right";

            let total:number = Math.floor(obj.fontEndFee + trailingFee.trailing_fee);
            this.gagueBar(empIc,Math.floor(total),labelTarget);
            
            // console.log(total +"<"+ labelTarget);
            if(total < labelTarget){
                row.style.backgroundColor = "#FADBD8";
            }else{
                row.style.backgroundColor = "#E9F7EF";
            }
            let userObj:user4Excel = {
                ic: user.ic_code,
                name:user.name_th+" "+user.lastname_th,
                target:labelTarget,
                totalFee:total_fee,
                amountWaiting:obj.waitingAmount
            }
            this.jsonArray.push(userObj);
        }
    }

    public genRM_Performance(datas:any):void{
        console.log("++++++++++++++genRM_Performance++++++++++++++++++++++++++++++++++");
        console.log(datas);
        this.jsonArray = [];

        const tableBody = document.querySelector("#rm-performance-table tbody");
        this.removeRows();

        if(datas.length>0){
            datas.forEach(rowData  => {
                const empIc = 'emp-'+rowData.ic;

                const newRow = document.createElement("tr");
                
                let totalFee = rowData.rmTrailing + rowData.totalFrontEndFee;
                newRow.innerHTML = `
                    <td>${rowData.ic}</td>
                    <td>${rowData.name}</td>
                    <td style='text-align:right'>${this.getCurrency(rowData.target)}</td>
                    <td style='text-align:right'>${this.getCurrency(totalFee)}</td>
                    <td>${this.setGagueBar(empIc)}</td>`;
                if (tableBody) {
                    tableBody.appendChild(newRow);
                } else {
                    console.error("Table body not found");
                }
                let target = 0;
                if(rowData.target !=0 ){
                    target = rowData.target;
                }else{
                    target = 100;
                    totalFee = 0;
                }
                this.gagueBar(empIc,Math.floor(totalFee),target);

                let userObj:user4Excel = {
                    ic: rowData.ic,
                    name:rowData.name,
                    target:rowData.target,
                    totalFee:totalFee,
                    amountWaiting:rowData.waitingAmount
                    // amountWaiting:0
                }
                this.jsonArray.push(userObj);
            });
        }

    }
    private setGagueBar(id:string):string{
        let code = ' <div class="progress bg-warning" id="'+id+'-1">'
                code +='<div id="'+id+'-2" class="progress-bar bg-warning" role="progressbar" aria-label="Example with label" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>';
            code +='</div>';
            code +='<div class="digital col-12" id="'+id+'-3">';
                // code +='<label id="'+id+'-4">0</label><label>/</label><label id="'+id+'-5">100</labe>.';
                code +='<label id="'+id+'-6">0</label><label>.';
            code +='</div>';
        return code;
    }
    private gagueBar(id:string,val:number,target:number):void{
        val =  Math.abs(val);
        let idBG = id+'-'+1;
        let idGague = id+'-'+2;
        let idLabelPerformance = id+'-'+4;
        let idLabelTarget = id+'-'+5;
        let idPercent = id+'-'+6;

        const percent =Math.floor( val/target *100);

        const obj1:any = document.getElementById(idBG);
        const obj2:any = document.getElementById(idGague);
        // const labelPerformance:any = document.getElementById(idLabelPerformance);
        // const labelTarget:any = document.getElementById(idLabelTarget);
        const labelPercent:any = document.getElementById(idPercent);

        // labelPerformance.innerHTML = Math.floor(val).toLocaleString('en-US');
        // labelTarget.innerHTML = Math.floor(target).toLocaleString('en-US');
        labelPercent.innerHTML = percent+"%";
        if(val <= target){
            obj2.innerHTML = percent+'%';
            obj2.style.width = percent+'%';

            obj1.classList.remove("bg-warning");
            obj1.classList.remove("progress-bar-striped");
            obj2.classList.add("bg-warning");
        }else{
            let over_val = val-target;
            let percentDisplay = over_val/target * 100;
            obj2.innerHTML = percent+'%';
            obj2.style.width = percentDisplay+'%';

            obj1.classList.add("bg-warning");
            obj1.classList.add("progress-bar-striped");
            obj2.classList.remove("bg-warning");
            obj2.classList.add("bg-success");
        }
    }

    public removeRows():void {
        //console.log("remove rows------------");
        let table:any = document.getElementById(this.table_id);
        if(table.rows.length > 0){
            for (let i = table.rows.length; i > 1; i--) {
                table.deleteRow(1);
            }
        }   
    }
    public json4Excel(){
        // console.log(this.jsonArray);
        return this.jsonArray;
    }

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
    public getValidateFreelancer(ic_code:string ,amcCode:string,transactionDate:string,sharing:number){

        const incentives = this.incentives.filter(item=> item.ic_code === ic_code);
        const startDate = new Date('2024-01-31');
        let datePart = transactionDate.split(" ")[0];
        let parts = datePart.split("/");
        let date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const transaction_date = new Date(date);

        if(ic_code.indexOf('F') === 0){            
            if(transaction_date > startDate){
                if(incentives.length>0){
                    this.incentive = incentives[0].incentive;
                }else{
                    this.incentive = 0.75;
                }
                
                this.offsetFee = 0;                                             // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM Freelancer
                if(amcCode ==='ASSETFUND' || amcCode ==='KTAM'){
                    if(sharing === undefined || sharing === 0.7){
                        sharing = 1;
                    }
                }
            }
        }else{
            this.incentive = 1;
            this.offsetFee = 10;                                                // Set ค่าป้องกันการ Error กับการคำนวนสำหรับ RM ทั่วไป
        }
        return sharing;
    }
    public getCurrency(val:number):string{
        if(val !==0){
            val = Math.floor(val);
            const currencyValue:string = new Intl.NumberFormat('th-TH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(val);
            return this.antiNaN(currencyValue);
        }else{
            return "0";
        }
    }
    public antiNaN(value:any):string{
        if(value === "NaN"){
            return "";
        }
        return ""+value;
    }
}

