
class TransactionTable{
    private permission:number = 0;
    private table_id:string;
    private transactions:Array<any>;
    private table:HTMLTableElement;
    private DATAs:any;
    private user:any;
    private team:any;
    private dataTeam:any;
    private startDate:string;
    private endDate:string;
    private ic_code:string;
    private sumSalary:number =0;
    private totalIncentive:number=0;

    private member:any;

    constructor(table_id,transactions){
        this.table_id = table_id;
        this.transactions = transactions;
        this.table = document.getElementById(table_id) as HTMLTableElement;
    }

    public setPermission(permission:number){
        this.permission = permission;
    }
    public setDate(st,ed,ic_code){
        this.startDate = st;
        this.endDate = ed;
        this.ic_code = ic_code;
    }
    public setUser(user){
        this.user = user;
    }
    public setTeam(team){
        this.team = team;
    }
    public setData(data){
        this.DATAs = data;
    }
    public antiNaN(value:any):string{
        if(value === "NaN"){
            return "";
        }
        return ""+value;
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
    public sortedFundCode(obj){
        return obj.sort((a, b) => a.fundcode.localeCompare(b.fundcode));
    }
    public removeRows():void {
        let table:any = document.getElementById(this.table_id);
        if(table.rows.length > 2){
            for (let i = table.rows.length; i > 2; i--) {
                table.deleteRow(2);
            }
        }   
    }

    public renderTable(data, transactions){
        console.log(">>> render TransactionTable.ts <<<<");
        this.DATAs = data;
        let fundCodes = data.fund_codes;
        console.log(transactions);
        if(transactions.length > 0){
            fundCodes = this.sortedFundCode(fundCodes);
        }else{
            alert("No Transaactions");
        }
        this.removeRows();

        for(let i=0;i<fundCodes.length;i++){
            let fundCode = fundCodes[i];
            let row:any = this.table.insertRow(this.table.rows.length);
            
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);

            let cell6 = row.insertCell(2);
            let cell7 = row.insertCell(3);
            let cell12 = row.insertCell(4);
            let cell13 = row.insertCell(5);
            let cell14 = row.insertCell(6);

            cell0.innerHTML = "<lable>"+fundCode.fundcode+"</lable>";
            cell1.style.textAlign = "left";
            cell1.innerHTML = this.getCurrency(fundCode.subAmount);
            cell1.style.textAlign = "right";

            let text6 = 'WCC = '+(fundCode.wccSharing*100)+'%';
            let incentive = fundCode.incentive *100;
            let rmSharing = fundCode.rmSharing *100;
            text6 += ', RM = '+rmSharing+'%';
            text6 = "Net Fee= "+this.getCurrency(fundCode.subNetFee)+": "+text6;

            if(this.permission >=3){
                cell6.innerHTML = "<a title='"+text6+"' href='#'>"+this.getCurrency(fundCode.subFrontEndFee)+"</a>";
            }else{
                cell6.innerHTML = this.getCurrency(fundCode.subFrontEndFee);
            }
            
            cell6.style.textAlign = "right";
            cell7.innerHTML = this.getCurrency(fundCode.swiAmount);
            cell7.style.textAlign = "right";

            let text12 = 'WCC = '+(fundCode.wccSharing*100)+'%';
            text12 += ', RM = '+rmSharing+'%';
            text12 = "Net Fee= "+this.getCurrency(fundCode.swiNetFee)+": "+text12;
            if(this.permission >=3 ){
                cell12.innerHTML = "<a title='"+text12+"' href='#'>"+this.getCurrency(fundCode.swiFrontEndFee)+"</a>";
            }else{
                cell12.innerHTML = this.getCurrency(fundCode.swiFrontEndFee);
            }
            
            cell12.style.textAlign = "right";

            cell13.innerHTML = this.getCurrency(fundCode.totalAmount);
            cell13.style.textAlign = "right";
            cell14.innerHTML = this.getCurrency(fundCode.totalFrontEndFee);
            cell14.style.textAlign = "right";
        }
        
        let footer = this.table.createTFoot();
        let row = footer.insertRow(0);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);
        let cell5 = row.insertCell(5);
        let cell6 = row.insertCell(6);


        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        let grandTotalSubAmount = this.getCurrency( data['1grandTotalSubAmount']);
        cell1.innerHTML = "<b>"+grandTotalSubAmount +"</b>";
        cell1.style.textAlign = "right";

        let grandTotalSubFrontEndFee = this.getCurrency( data['2grandTotalSubFontEndFee']);
        cell2.innerHTML = "<b>"+grandTotalSubFrontEndFee +"</b>";
        cell2.style.textAlign = "right";

        let grandTotalSwiAmount = this.getCurrency( data['3grandTotalSwiAmount']);
        cell3.innerHTML = "<b>"+grandTotalSwiAmount +"</b>";
        cell3.style.textAlign = "right";

        let grandTotalSwiFrontEndFee = this.getCurrency( data['4grandTotalSwiFontEndFee']);
        cell4.innerHTML = "<b>"+grandTotalSwiFrontEndFee +"</b>";
        cell4.style.textAlign = "right";

        let grandTotalAmount = this.getCurrency( data['5grandTotalAmount']);
        cell5.innerHTML = "<b>"+grandTotalAmount +"</b>";
        cell5.style.textAlign = "right";

        let grandTotalFrontEndFee = this.getCurrency( data['6grandTotalFrontEndFee']);
        cell6.innerHTML = "<b>"+grandTotalFrontEndFee +"</b>";
        cell6.style.textAlign = "right";
    }

    public renderTableTeam(data){
        
        this.dataTeam = data;
        let fundCodes = data.fundCodeTeam;
        this.member = data.member;
        if(fundCodes.length > 0){
            fundCodes = this.sortedFundCode(fundCodes);
        }
        this.removeRows();
        for(let i=0;i<fundCodes.length;i++){
            let fundCode = fundCodes[i];

            let row:any = this.table.insertRow(this.table.rows.length);
            
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);

            let cell6 = row.insertCell(2);
            let cell7 = row.insertCell(3);
            let cell12 = row.insertCell(4);
            let cell13 = row.insertCell(5);
            let cell14 = row.insertCell(6);

            cell0.innerHTML = "<lable>"+fundCode.fundcode+"</lable>";
            cell1.style.textAlign = "left";
            cell1.innerHTML = this.getCurrency(fundCode.subAmount);
            cell1.style.textAlign = "right";

            cell6.innerHTML = this.getCurrency(fundCode.subFrontEndFee);
            cell6.style.textAlign = "right";
            cell7.innerHTML = this.getCurrency(fundCode.swiAmount);
            cell7.style.textAlign = "right";

            cell12.innerHTML = this.getCurrency(fundCode.swiFrontEndFee);
            cell12.style.textAlign = "right";

            cell13.innerHTML = this.getCurrency(fundCode.totalAmount);
            cell13.style.textAlign = "right";
            cell14.innerHTML = this.getCurrency(fundCode.totalFrontEndFee);
            cell14.style.textAlign = "right";
            
        }
        let footer = this.table.createTFoot();
        let row = footer.insertRow(0);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);
        let cell5 = row.insertCell(5);
        let cell6 = row.insertCell(6);

        cell0.innerHTML = "<b>Grand Total</b>";
        cell0.style.textAlign = "right";
        let grandTotalSubAmount = this.getCurrency( data['1grandTotalSubAmount']);
        cell1.innerHTML = "<b>"+grandTotalSubAmount +"</b>";
        cell1.style.textAlign = "right";

        let grandTotalSubFrontEndFee = this.getCurrency( data['2grandTotalSubFontEndFee']);
        cell2.innerHTML = "<b>"+grandTotalSubFrontEndFee +"</b>";
        cell2.style.textAlign = "right";

        let grandTotalSwiAmount = this.getCurrency( data['3grandTotalSwiAmount']);
        cell3.innerHTML = "<b>"+grandTotalSwiAmount +"</b>";
        cell3.style.textAlign = "right";

        let grandTotalSwiFrontEndFee = this.getCurrency( data['4grandTotalSwiFontEndFee']);
        cell4.innerHTML = "<b>"+grandTotalSwiFrontEndFee +"</b>";
        cell4.style.textAlign = "right";

        let grandTotalAmount = this.getCurrency( data['5grandTotalAmount']);
        cell5.innerHTML = "<b>"+grandTotalAmount +"</b>";
        cell5.style.textAlign = "right";

        let grandTotalFrontEndFee = this.getCurrency( data['6grandTotalFrontEndFee']);
        cell6.innerHTML = "<b>"+grandTotalFrontEndFee +"</b>";
        cell6.style.textAlign = "right";
    }
    
    public rederBoxTeamPerf(){

        //=========================== Title =========================================
        let headerSheet = this.dataTeam.teamName+ " ["+this.dataTeam.member+"]";
        const headerElement =  document.getElementById('nameRM');
        if (headerElement) {headerElement.innerHTML = headerSheet;}

        // ======================== RM Box ==========================================
        const icLabelElement = document.getElementById('label_ic');
        const icCodeElement = document.getElementById('ic_code');
        const targetElement = document.getElementById('target');
        const fontEndFeeElement = document.getElementById('fontEndFee');
        
        const trailingElement = document.getElementById('trailing');
        const totalFeeElement = document.getElementById('total_fee');
        const performanceElement = document.getElementById('performance');


        if (icLabelElement) {icLabelElement.innerHTML = this.team.remark;}
        if (icCodeElement) {icCodeElement.innerHTML = '';}
        if (targetElement) {targetElement.innerHTML = this.getCurrency(this.dataTeam.target);}
        
        if (fontEndFeeElement) {
            let total = this.getCurrency(this.dataTeam['6grandTotalFrontEndFee']);
            fontEndFeeElement.innerHTML = total;
        }
        let trailingRM =  this.dataTeam.rmTrailingFee;
        if (trailingElement) {trailingElement.innerHTML = this.getCurrency(trailingRM);}

        let totalFee =this.dataTeam['6grandTotalFrontEndFee'] + trailingRM;
        if (totalFeeElement) {totalFeeElement.innerHTML = this.getCurrency(totalFee);}
        if (performanceElement) {
            let target = parseFloat(this.dataTeam.target);
            let pef = totalFee - target;
            let className ='per-red';
            if(pef > 0){ className = 'per-green';}
            let txt = '<label class="'+className+'">'+this.getCurrency(pef) +'</label>'
            performanceElement.innerHTML = txt;
        }

        //========================== RM Incentive ==================================
        const teamAUM_Element = document.getElementById('aum_val');

        const salaryElement  = document.getElementById('salary');
        const salaryCaptionElement  = document.getElementById('caption_salary');
        const incentiveSharingElement  = document.getElementById('incentive');
        const rmPromotionElement  = document.getElementById('promotion_val');
        const rmTotalIncentiveCaption = document.getElementById('caption_totalPay');
        const rmTotalIncentiveElement = document.getElementById('totalPay');
        
        if (teamAUM_Element) {teamAUM_Element.innerHTML = this.getCurrency(this.dataTeam.totalAUM);}
        if (salaryCaptionElement) {salaryCaptionElement.innerHTML ='Team Salary:';}
        if (salaryElement) {salaryElement.innerHTML =this.getCurrency( this.dataTeam.salary);}
        if (incentiveSharingElement) {incentiveSharingElement.innerHTML =this.getCurrency( this.dataTeam.sumPaySharing);}
        if (rmPromotionElement) {rmPromotionElement.innerHTML =this.getCurrency(this.dataTeam.rmPromotion);}
        if (rmTotalIncentiveCaption) {rmTotalIncentiveCaption.innerHTML ='Total:';}
        if (rmTotalIncentiveElement) {rmTotalIncentiveElement.innerHTML = this.getCurrency(this.dataTeam.totalIcentive)}

        //========================== WCC Revenue ==================================
        const wccFrontEndFeeElement  = document.getElementById('caption_feeSummary');
        const wccTrailingFeeElement  = document.getElementById('caption_wccTrailingFee');
        const wccPromotionFeeElement  = document.getElementById('wcc_promotion_val');
        const wccTotalRevenueElement  = document.getElementById('caption_WCCPerf');
        const netRevenueElement  = document.getElementById('value_gp');
        const netSharingElement  = document.getElementById('caption_gp');
        
        let wccFrontEndFee = this.dataTeam['7grandTotalWCCFrontEndFee'];
        let wccTrailingFee = this.dataTeam.wccTrailingFee;
        let wccPromotion = this.dataTeam.wccPromotion;
        let totalRevenue = wccFrontEndFee+wccTrailingFee+wccPromotion;
        
        let totalIncentive =this.dataTeam.totalIcentive;
        let netRevenue = totalRevenue - totalIncentive;
        let netSharing = netRevenue / totalRevenue *100;


        if (wccFrontEndFeeElement) {wccFrontEndFeeElement.innerHTML =this.getCurrency(wccFrontEndFee);}
        if (wccTrailingFeeElement) {wccTrailingFeeElement.innerHTML =this.getCurrency(wccTrailingFee);}
        if (wccPromotionFeeElement) {wccPromotionFeeElement.innerHTML =this.getCurrency(wccPromotion);}
        
        if (wccTotalRevenueElement) {wccTotalRevenueElement.innerHTML =this.getCurrency(totalRevenue);}
        if (netRevenueElement) {netRevenueElement.innerHTML =this.getCurrency(netRevenue);}
        if (netSharingElement) {netSharingElement.innerHTML =this.getCurrency(netSharing) +"%";}
    }

/**
 * 
 *============ @param objUserTarget ==============================================================================================
 */
    public rederBoxUserPerf(objUserTarget){
        console.log(">> rederBoxUserPerf : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        const [targets,salaries,trailing] = objUserTarget;
        // console.log(trailing);
        //=========================== Title =========================================
        let headerSheet = this.DATAs.profile.name_eng+" "+this.DATAs.profile.last_name_eng
            +" IC:"+this.DATAs.profile.ic_code;
        const headerElement =  document.getElementById('nameRM');
        if (headerElement) {headerElement.innerHTML = headerSheet;}

        // ======================== RM Box ==========================================
        let sumTarget = 0;
        let targetDetail = '';
        if(targets.length >0){
            for(let i=0; i < 1; i++){
                const t = targets[i];
                sumTarget += parseInt(t.target);
                targetDetail += t.target +","
            }
        }
        
        
        const icCodeElement = document.getElementById('ic_code');
        if (icCodeElement) {icCodeElement.innerHTML = this.DATAs.profile.ic_code};

        const targetElement = document.getElementById('target');
        if (targetElement) {
            if(targetDetail !== "")
                targetElement.innerHTML = `<a href="#" title="[${targetDetail}]">${this.getCurrency(sumTarget)}</a>`
        }

        const fontEndFeeElement = document.getElementById('fontEndFee');
        if (fontEndFeeElement) {
            let total = this.getCurrency(this.user.frontEndFee);
            fontEndFeeElement.innerHTML = total;
        }

        const sumTrailingFee:number = this.getTrailingFee(trailing);
        const trailingDate:string = this.getTrailingDate(trailing);
        const trailingElement = document.getElementById('trailing');
        const trailingDateElement = document.getElementById('trailing-date');
        if (trailingElement) {
            trailingElement.innerHTML =this.getCurrency(sumTrailingFee);
        }
        if (trailingDateElement) {
            trailingDateElement.innerHTML =trailingDate;
        }

        const totalFeeElement = document.getElementById('total_fee');
        let totalFee = sumTrailingFee+this.user.frontEndFee;
        if (totalFeeElement) {totalFeeElement.innerHTML = this.getCurrency(totalFee);}

        const performanceElement = document.getElementById('performance');
        let pef = totalFee - sumTarget;
        if (performanceElement) {
            // let target = parseFloat(sumTarget);
            
            let className ='per-red';
            if(pef > 0){ className = 'per-green';}
            let txt = '<label class="'+className+'">'+this.getCurrency(pef) +'</label>'
            performanceElement.innerHTML = txt;
        }

        //========================== RM Incentive ==================================
        const teamAUM_Element = document.getElementById('aum_val');

        const salaryElement  = document.getElementById('hide-salary');
        const salaryCaptionElement  = document.getElementById('caption_salary');
        const incentiveSharingElement  = document.getElementById('incentive');
        const rmPromotionElement  = document.getElementById('promotion_val');
        const rmTotalIncentiveCaption = document.getElementById('caption_totalPay');
        const rmTotalIncentiveElement = document.getElementById('hide-totalPay');
        
        // if (teamAUM_Element) {teamAUM_Element.innerHTML = this.getCurrency(this.dataTeam.totalAUM);}
        if (salaryCaptionElement) {salaryCaptionElement.innerHTML ='Salary:';}
        let sumSalary = 0;
        let salaryDetail = '';
        if(salaries.length >0){
            for(let i=0; i < salaries.length; i++){
                const t = salaries[i];
                sumSalary += parseInt(t.base_salary);
                salaryDetail += t.base_salary +","
            }
        }else{
            sumSalary = this.user.salary;
            salaryDetail = this.user.salary+"";
        }
        this.sumSalary = sumSalary;
        
        let totalSharing = 0;
        let txtTotalSharing = '0';
        let txtPayPromotionRM = '0';
        let payPromotionRM = 0;
        if(pef>0){
            // ============== ถ้า RM เป็น Freelance ============================
            if(this.DATAs.profile.ic_code.indexOf('F') === 0){
                totalSharing = 0;
            }else{
            // ============== ถ้า RM เป็น ประจำ ============================
                totalSharing = pef * this.user.incentive;
                txtTotalSharing = `<a href="#" title="${this.getCurrency(pef)} x ${this.user.incentive}">${this.getCurrency(totalSharing)}</a>`;

                txtPayPromotionRM = this.getCurrency(this.user.payPromotion.total_reward);
                payPromotionRM = this.user.payPromotion.total_reward;
            }
        }
        
        if (incentiveSharingElement) {incentiveSharingElement.innerHTML = txtTotalSharing;}

        if (rmPromotionElement) {rmPromotionElement.innerHTML =txtPayPromotionRM;}

        let totalIncentive = sumSalary + totalSharing + payPromotionRM;
        this.totalIncentive = totalIncentive;

        if (rmTotalIncentiveCaption) {rmTotalIncentiveCaption.innerHTML ='Total:';}
        // if (rmTotalIncentiveElement) {rmTotalIncentiveElement.innerHTML = this.getCurrency(totalIncentive)}
        let textTotalPay = this.getCurrency(this.totalIncentive);
        if (salaryElement) {
            let text;

            if(this.DATAs.profile.ic_code.indexOf('F') === 0){
                text = totalFee;
            }else{
                text = this.getCurrency(sumSalary);
            }
            if(this.permission ==1 || this.permission ==2){
                text = "########";
                textTotalPay = "########";
            }else if(this.permission ==3){
                text = "########";
                textTotalPay = "########";
            }
            salaryElement.textContent =text;
        }
        if (rmTotalIncentiveElement) {rmTotalIncentiveElement.innerHTML = textTotalPay;}

        //========================== WCC Revenue ==================================
        const wccFrontEndFeeElement  = document.getElementById('caption_feeSummary');
        const wccTrailingFeeElement  = document.getElementById('caption_wccTrailingFee');
        const wccPromotionFeeElement  = document.getElementById('wcc_promotion_val');
        const wccTotalRevenueElement  = document.getElementById('caption_WCCPerf');
        const netRevenueElement  = document.getElementById('value_gp');
        const netSharingElement  = document.getElementById('caption_gp');
        
        let wccFrontEndFee = this.DATAs['7grandTotalWCCFrontEndFee'];

        let wccTrailingFee = this.getWCCTrailingFee(trailing);
        let wccPromotion = this.user.payPromotion.feeAfterWithholdingTaxAndSharing;
        let totalRevenue = wccFrontEndFee+wccTrailingFee+wccPromotion;
        
        // let totalIncentive =this.user.totalIcentive;
        let netRevenue = totalRevenue - totalIncentive;
        let netSharing = netRevenue / totalRevenue *100;


        if (wccFrontEndFeeElement) {wccFrontEndFeeElement.innerHTML =this.getCurrency(wccFrontEndFee);}
        if (wccTrailingFeeElement) {wccTrailingFeeElement.innerHTML =this.getCurrency(wccTrailingFee);}
        if (wccPromotionFeeElement) {wccPromotionFeeElement.innerHTML =this.getCurrency(wccPromotion);}
        
        if (wccTotalRevenueElement) {wccTotalRevenueElement.innerHTML =this.getCurrency(totalRevenue);}
        if (netRevenueElement) {netRevenueElement.innerHTML =this.getCurrency(netRevenue);}
        if (netSharingElement) {netSharingElement.innerHTML =this.getCurrency(netSharing) +"%";}  

        const _ic= this.DATAs.profile.ic_code;
        const _target = sumTarget;
        const _fontEndFee = this.user.frontEndFee;
        const _trailingFee = sumTrailingFee;
        const _total = totalFee;

        const _perf = pef;

        const _wccFrontEndFee =wccFrontEndFee;
        const _wccTrailingFee = wccTrailingFee;

        let display = `
            <table border='1' style='padding:1em'>
                <tr>
                    <td style='padding:1em'> ${_ic} </td>
                    <td style='padding:1em'> ${_target} </td>
                    <td style='padding:1em'> ${_fontEndFee} </td>
                    <td style='padding:1em'> ${_trailingFee} </td>
                    <td style='padding:1em'> ${_total} </td>
                    <td style='padding:1em'> ${_perf} </td>
                    <td style='padding:1em'> ${_wccFrontEndFee} </td>
                    <td style='padding:1em'> ${_wccTrailingFee} </td>
                </tr>
            </table> `;
        let wccDisplay =`
            <table border='1' style='padding:1em'>
                <tr>
                    <td style='padding:1em'> ${_wccFrontEndFee} </td>
                    <td style='padding:1em'> ${_wccTrailingFee} </td>
                </tr>
            </table> `;

        const exElement  = document.getElementById('display4excel');
        const wccExElement  = document.getElementById('display4excelWCC');
        
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
    }

    public async getUserMetrics(st,ed,ic_code){
        const url = "./targets";
        try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // เพิ่ม headers ที่จำเป็น เช่น Authorization ถ้าจำเป็น
                // 'Authorization': 'Bearer YOUR_TOKEN'
              },
              body: JSON.stringify({
                startDate: st,
                endDate: ed,
                ic_code:ic_code
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // แปลงผลลัพธ์เป็น JSON
            console.log(data);
            return data;
          } catch (error) {
            console.error('Error fetching sharing data:', error);
            throw error; // โยน error กลับไปเพื่อให้ผู้ใช้จัดการ
          }
    }
    public getTrailingFee(data):any{
        if(data.length>0){
            return data[0].rmTrailingFee;
        }else{
            return 0
        }
    }
    public getTrailingDate(json):string{
        if(json.length>0){
            const date = new Date(json[0].month_active);
            return "("+this.formatDateToString(date)+")";
        }else{
            return ""
        }
    }
    public formatDateToString(date) {
        const day = String(date.getDate()).padStart(2, '0'); // แปลงวันที่เป็น 2 หลัก
        const month = String(date.getMonth() + 1).padStart(2, '0'); // แปลงเดือนเป็น 2 หลัก (+1 เพราะ getMonth() เริ่มจาก 0)
        const year = date.getFullYear(); // รับค่า ค.ศ.
    
        return `${day}/${month}/${year}`; // รวมค่าที่ได้ในรูปแบบ DD-MM-YYYY
    }
    public getTotalRmTrailingFee(data) :any{
        // กรองข้อมูลโดยเลือก `rmTrailingFee` ล่าสุดในแต่ละเดือน
        const latestPerMonth = data.reduce((acc, curr) => {
            const month = curr.month;
    
            // ถ้ายังไม่มีข้อมูลในเดือนนี้ หรืออัปเดตใหม่กว่า
            if (!acc[month] || new Date(curr.updated) > new Date(acc[month].updated)) {
                acc[month] = curr;
            }
            return acc;
        }, {});
    
        // ดึงค่าจาก `rmTrailingFee` และรวมผลลัพธ์ทั้งหมด
        return Object.values(latestPerMonth).reduce(
            (sum, item:any) => sum + item.rmTrailingFee,
            0
        );
    }
    public getTotalWCCTrailingFee(data) :any{
        // กรองข้อมูลโดยเลือก `rmTrailingFee` ล่าสุดในแต่ละเดือน
        const latestPerMonth = data.reduce((acc, curr) => {
            const month = curr.month;
    
            // ถ้ายังไม่มีข้อมูลในเดือนนี้ หรืออัปเดตใหม่กว่า
            if (!acc[month] || new Date(curr.updated) > new Date(acc[month].updated)) {
                acc[month] = curr;
            }
    
            return acc;
        }, {});
    
        // ดึงค่าจาก `rmTrailingFee` และรวมผลลัพธ์ทั้งหมด
        return Object.values(latestPerMonth).reduce(
            (sum, item:any) => sum + item.wccTrailingFee,
            0
        );
    }
    public getWCCTrailingFee(data){
        if(data.length>0){
            return data[0].wccTrailingFee;
        }else{
            return 0
        }
    }

    public revealSalary(id) {
        // ค้นหา element ด้วย id
        const element = document.getElementById(id);
        if (element && element.textContent === "########") {
            if(this.permission !==3){
                if(id == 'hide-salary'){
                    element.textContent = this.getCurrency(this.sumSalary);
                }else if(id == 'hide-totalPay'){
                    element.textContent = this.getCurrency(this.totalIncentive);
                }
            }
        }
      }
}