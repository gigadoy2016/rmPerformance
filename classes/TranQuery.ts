import { Transaction } from "./Transaction";
import { Debug } from "./Debug";
// import { connection } from '../config/dbConfig';

export class TranQuery extends Transaction{
    private datas:any =[];
    private debug:Debug = new Debug(true,"TranQuery.ts");
    private tran:Transaction = new Transaction();
    
    constructor(datas:any){
        super();
        this.datas = datas;
    }

    public getTransactionByDate(startDate:string, endDate:string):string{

        let SQL = `SELECT 
            DATE_FORMAT(T.transaction_date, '%d/%m/%Y %H:%i') transaction_date
            ,T.transaction_type 
            ,T.fund_code 
            ,T.account_id
            ,T.ic
            ,T.status 
            ,FORMAT(ROUND(T.confirmed_units, 2), 2, 'th_TH') AS confirmed_units
            ,FORMAT(ROUND(T.amount, 2), 2, 'th_TH') AS amount
            ,FORMAT(ROUND(T.confirmed_amount, 2), 2, 'th_TH') AS confirmed_amount
            ,T.amc_code 
            ,T.settlement_bank
            ,T.customer_name 
            ,T.status
            ,DATE_FORMAT(T.effective_date, '%d/%m/%Y') effective_date
            ,T.settlement_bank_account
		    ,DATE_FORMAT(T.allotment_date, '%d/%m/%Y') allotment_date
            ,DATE_FORMAT(T.nav_date, '%d/%m/%Y') nav_date
            ,FORMAT(ROUND(T.fee, 2), 2, 'th_TH') AS fee
            ,FORMAT(ROUND(T.vat, 2), 2, 'th_TH') AS vat 
            ,FORMAT(ROUND(T.allotted_nav, 2), 2, 'th_TH') AS allotted_nav
            ,FORMAT(ROUND(T.withholding_tax, 2), 2, 'th_TH') AS withholding_tax
            ,DATE_FORMAT(T.settlement_date, '%d/%m/%Y') settlement_date
            ,T.settlement_bank 
		    ,AMC.selling_fee 
            ,AMC.sharing 
            ,(T.fee * 0.03) wh3 
            ,order_reference
            ,xwt_reference_no
            ,counter_payment_type
            ,counter_fund_code 
        FROM transactions T LEFT JOIN   
            asset_companys AMC 
            ON T.fund_code = AMC.fund_code `;
        SQL += "WHERE T.transaction_date BETWEEN  STR_TO_DATE('"+startDate+" 00:01','%Y-%m-%d %H:%i') AND STR_TO_DATE('"+endDate+" 23:59','%Y-%m-%d %H:%i')"
        // SQL += "WHERE T.allotment_date BETWEEN  STR_TO_DATE('"+startDate+" 00:01','%Y-%m-%d %H:%i') AND STR_TO_DATE('"+endDate+" 23:59','%Y-%m-%d %H:%i')"
        SQL += " AND (T.status='ALLOTTED' OR T.status='WAITING' OR T.status='SUBMITTED' OR T.status='APPROVED') "
        // SQL += " AND (T.transaction_type = 'SUB' OR T.transaction_type = 'SWI' )";
        SQL += " AND (T.transaction_type = 'SUB' OR T.transaction_type = 'SWI' OR T.transaction_type = 'RED')";
        // this.debug.debugLog(SQL);
        return SQL;
    }

    public getTranByAllotmentDate(ic:string,startDate:string, endDate:string):string{
        // this.debug.debugLog(">>>> Function  getTransactionByAllotmentDate():"+startDate+"-"+endDate);
        let SQL = `SELECT 
            DATE_FORMAT(T.transaction_date, '%d/%m/%Y %H:%i') transaction_date
            ,T.transaction_type 
            ,T.fund_code 
            ,T.account_id
            ,T.ic
            ,T.status 
            ,FORMAT(ROUND(T.confirmed_units, 2), 2, 'th_TH') AS confirmed_units
            ,FORMAT(ROUND(T.amount, 2), 2, 'th_TH') AS amount
            ,FORMAT(ROUND(T.confirmed_amount, 2), 2, 'th_TH') AS confirmed_amount
            ,T.amc_code 
            ,T.settlement_bank
            ,T.customer_name 
            ,T.status
            ,DATE_FORMAT(T.effective_date, '%d/%m/%Y') effective_date
            ,T.settlement_bank_account
		    ,DATE_FORMAT(T.allotment_date, '%d/%m/%Y') allotment_date
            ,DATE_FORMAT(T.nav_date, '%d/%m/%Y') nav_date
            ,FORMAT(ROUND(T.fee, 2), 2, 'th_TH') AS fee
            ,FORMAT(ROUND(T.vat, 2), 2, 'th_TH') AS vat 
            ,FORMAT(ROUND(T.allotted_nav, 2), 2, 'th_TH') AS allotted_nav
            ,FORMAT(ROUND(T.withholding_tax, 2), 2, 'th_TH') AS withholding_tax
            ,DATE_FORMAT(T.settlement_date, '%d/%m/%Y') settlement_date
            ,T.settlement_bank 
		    ,AMC.selling_fee 
            ,AMC.sharing 
            ,(T.fee * 0.03) wh3 
            ,order_reference
            ,xwt_reference_no
            ,counter_payment_type
            ,counter_fund_code 
        FROM transactions T LEFT JOIN   
            asset_companys AMC 
            ON T.fund_code = AMC.fund_code `;
        SQL += "WHERE T.allotment_date BETWEEN  STR_TO_DATE('"+startDate+"','%Y-%m-%d') AND STR_TO_DATE('"+endDate+"','%Y-%m-%d')"
        SQL += " AND (T.status='ALLOTTED' OR T.status='WAITING' OR T.status='SUBMITTED' OR T.status='APPROVED') "
        SQL += " AND (T.transaction_type = 'SUB' OR T.transaction_type = 'SWI') AND ic='"+ic+"'";
        this.debug.debugLog(SQL);
        return SQL;
    }

    public getTransactionByIC(startDate:string, endDate:string,ic:string):string{
        let SQL = this.getTransactionByDate(startDate,endDate);
        SQL += " AND ic='"+ic+"'"
        console.log(SQL);
        return SQL;
    }

    public getTransactions(iccode:string, startDate:string, endDate:string): string {
        this.debug.debugLog(">>>> Function  getTransactions():"+startDate+"-"+endDate);
        let SQL = this.getTransactionByDate(startDate,endDate) + " AND ic = '"+iccode+"' ";
        this.debug.debugLog(SQL);
        return SQL;
    }
    public getTransactionsByTeam(team:[], startDate:string, endDate:string): string {
        const member = team.join(',');
        // this.debug.debugLog(">>>> Function  getTransactionsByTeam():"+startDate+"-"+endDate);
        let SQL = this.getTransactionByDate(startDate,endDate) 
        + " AND ic IN ("+member+") ";
        // this.debug.debugLog(SQL);
        return SQL;
    }

    public genSqlInsert():string{
        // console.log(this.datas[0]);
        if(this.datas <= 0){
            return "Data not found;";
        }

        let SQL = "INSERT INTO transactions (";
        // let attributes = Object.getOwnPropertyNames(this.datas[0]);
        let attributes = Object.getOwnPropertyNames(this.tran.mappingField);
        let count = attributes.length;
        console.log(attributes);
        if(count>0){
            for(let i=0;i< count;i++){
                let attribute = attributes[i];
                let att = this.mappingField[attribute];
                // console.log(attribute+" = "+att);
                if(att !== undefined){
                    SQL += "`" + att + "` ,";
                }
            }
            SQL = SQL.slice(0, -1) + " ) VALUES "; 
        }else{
            return "Err: Data Not Found!!;"
        }
        return SQL + this.genValues();
    }

    public genSqlUpdate():string{
        let ans= '';
        // console.log(this.datas);
        if(this.datas <= 0){
            return "Data not found;";
        }
        for(let i=0;i < this.datas.length; i++){
            let tran = this.datas[i];
            console.log(tran);
            let SQL = "UPDATE transactions SET ";
            SQL += "status='"+tran["Status"]+"' ";
            if(tran["Unit"] ==""){
                SQL += ",unit=null ";
            }else{
                SQL += ",unit='"+tran["Unit"]+"' ";
            }
            SQL += ",confirmed_amount = '"+tran["Confirmed Amount"]+"' ";
            SQL += ",confirmed_units = '"+tran["Confirmed Units"]+"' ";
            SQL += ",approver = '"+tran["Approver"]+"' ";
            SQL += ",last_update = STR_TO_DATE('"+tran["Last Update"]+"', '%d/%m/%Y %H:%i' ) ";
            SQL += ",allotment_date = STR_TO_DATE('"+tran["Allotment Date"]+"', '%d/%m/%Y') ";
            SQL += ",nav_date = STR_TO_DATE('"+tran["NAV Date"]+"', '%d/%m/%Y') ";
            SQL += ",fee='"+tran["Fee"]+"' ";
            SQL += ",withholding_tax='"+tran["Withholding Tax"]+"' ";
            SQL += ",vat='"+tran["VAT"]+"' ";
            SQL += ",allotted_nav='"+tran["Allotted NAV"]+"' ";
            SQL += ",order_ref='"+tran["Order Referral"]+"' ";
            SQL += ",team='"+tran["Team"]+"' ";

            SQL += "WHERE ";
            SQL +="transaction_id='"+tran["Transaction ID"]+"' ";
            SQL +="AND transaction_type ='"+tran["Transaction Type"]+"' ";
            SQL +="AND fund_code ='"+tran["Fund Code"]+"' ";
            SQL +="AND account_id ='"+tran["Account ID"]+"' ";
            SQL +="AND unitholder_id ='"+tran["Unitholder ID"]+"';";
            ans += SQL;
        }
        return ans;
    }


    public genValues():any{
        //let data = "";
        // let attributes = Object.getOwnPropertyNames(this.datas[0]);
        let columns = Object.getOwnPropertyNames(this.tran.mappingField);

        let sql = " (";
        for(let j=0;j<this.datas.length;j++){
            // let value:any = [];
            // let attributes = Object.getOwnPropertyNames(this.datas[j]);
            for(let i=0;i < columns.length;i++){
                let attribute = columns[i];
                let att = this.mappingField[attribute];
                let data = this.datas[j][attribute];

                if(att !== undefined){
                    // == DateTime
                    // console.log(att);
                    if(att ==='transaction_date' || att === 'last_update'){
                        data = "STR_TO_DATE('"+data+"','%d/%m/%Y %H:%i')";
                        sql += " " + data +" ,";
                    // == Date
                    }else if(att ==='effective_date' || att ==='settlement_date'|| att ==='cheque_date' || 
                             att ==='allotment_date' || att === 'nav_date'){
                        if(data !== ''){
                            data = "STR_TO_DATE('"+data+"','%d/%m/%Y')";
                            sql += " " + data +",";
                        }else{
                            sql += " NULL,";
                        }
                    }else if(att === 'approver'){
                        //console.log(att + "==="+ data + "|"+(data == undefined) +"|"+ this.datas[j]['Transaction ID']);
                        if(data === undefined || data =='undefined'){
                            sql += " NULL ,";
                        }else{
                            sql += " '" + data +"',";
                        }
                    // == Decimal
                    }else if(att ==='amount' || att ==='unit' || att ==='confirmed_amount' || att ==='confirmed_units' || 
                             att === 'fee' || att ==='withholding_tax' || att ==='vat' || att ==='allotted_nav' ||
                             att === 'adls_fee' || att === 'liquidity_fee'
                             ){
                        //SQL += "`" + att + "` ,";
                        if(data ==='' || data === undefined){
                            sql += " NULL ,";
                        }else{
                            sql += " " + data +",";
                        }
                    }else{
                        if(data === undefined || data =='undefined'){
                            sql += " NULL ,";
                        }else{
                            sql += " '" + data +"',";
                        }
                    }
                }
            }
            // values.push(value);
            sql =sql.slice(0, -1);
            if(j == (this.datas.length-1)){
                sql +=");"
            }else{
                sql += "),(";
            }
            
        }
        // console.log(sql);
        return sql;
    }

    public fieldSelect:string = `SELECT 
            DATE_FORMAT(T.transaction_date, '%d/%m/%Y %H:%i') transaction_date
            ,T.transaction_type 
            ,T.fund_code 
            ,T.account_id
            ,T.ic
            ,T.status 
            ,FORMAT(ROUND(T.confirmed_units, 2), 2, 'th_TH') AS confirmed_units
            ,FORMAT(ROUND(T.amount, 2), 2, 'th_TH') AS amount
            ,FORMAT(ROUND(T.confirmed_amount, 2), 2, 'th_TH') AS confirmed_amount
            ,T.amc_code 
            ,T.settlement_bank
            ,T.customer_name 
            ,T.status
            ,DATE_FORMAT(T.effective_date, '%d/%m/%Y') effective_date
            ,T.settlement_bank_account
            ,DATE_FORMAT(T.allotment_date, '%d/%m/%Y') allotment_date
            ,DATE_FORMAT(T.nav_date, '%d/%m/%Y') nav_date
            ,FORMAT(ROUND(T.fee, 2), 2, 'th_TH') AS fee
            ,FORMAT(ROUND(T.vat, 2), 2, 'th_TH') AS vat 
            ,FORMAT(ROUND(T.allotted_nav, 2), 2, 'th_TH') AS allotted_nav
            ,FORMAT(ROUND(T.withholding_tax, 2), 2, 'th_TH') AS withholding_tax
            ,DATE_FORMAT(T.settlement_date, '%d/%m/%Y') settlement_date
            ,T.settlement_bank 
            ,AMC.selling_fee 
            ,AMC.sharing 
            ,(T.fee * 0.03) wh3 
            ,order_reference
            ,xwt_reference_no
            ,counter_payment_type
            ,counter_fund_code 
        FROM transactions T LEFT JOIN   
            asset_companys AMC 
            ON T.fund_code = AMC.fund_code `;
    }
// let datas = [{"Transaction Date":"01/02/2023 09:28","Account ID":"OM00119","Unitholder ID":"077400000071","Type":"OMN","Customer Name":"นาง มนวิภา เพ็ชรสุวรรณ","Transaction Type":"SUB","Registrar Flag":"","Fund Code":"ASP-DPLUS","ISIN":"TH7710010003","Cut-off Time":"15:30","Currency":"THB","Amount":100,"Unit":"","Sell All Unit":"","Status":"ALLOTTED","Confirmed Amount":100,"Confirmed Units":9.2158,"Effective Date":"01/02/2023","Settlement Date":"01/02/2023","Transaction ID":"2282302010341519","Payment Type":"TRN_SA","Bank/Issued By":"SCB","Bank Account/Credit No./Point Code":"0493147974","Approval Code":"","Cheque Date":"","Cheque No":"","Cheque Branch":"","Reject Reason":"","AMC Code":"ASSETFUND","PT":"N","IC":"4100","IC Branch":"400","Approver":"prakop.a","Last Update":"01/02/2023 20:34","Referral":"สุดคนึง หงส์ลดา","Settlement Bank":"SCB","Settlement Bank Account":"0493129120","Allotment Date":"01/02/2023","NAV Date":"01/02/2023","Investor Payment Instructor":"","Investor Payment Status":"","Fund Settlement Flag":"Y","Finnet Processing Type":"","Order Referral":"","Recurring Flag":"N","SA Recurring Order Reference No":"","Fee":0,"Withholding Tax":0,"VAT":0,"BCP":"N","Channel":"MKT","Reason to sell LTF/RMF":"","Allotted NAV":10.8509,"V.+ Order Ref. / AMC Order Ref.":"007723000190"},{"Transaction Date":"01/02/2023 09:30","Account ID":"OM00119","Unitholder ID":"9000000839","Type":"OMN","Customer Name":"นาง มนวิภา เพ็ชรสุวรรณ","Transaction Type":"SUB","Registrar Flag":"","Fund Code":"KFCASH-A","ISIN":"TH2759010006","Cut-off Time":"15:30","Currency":"THB","Amount":500,"Unit":"","Sell All Unit":"","Status":"ALLOTTED","Confirmed Amount":500,"Confirmed Units":37.3081,"Effective Date":"01/02/2023","Settlement Date":"01/02/2023","Transaction ID":"2282302010341520","Payment Type":"TRN_SA","Bank/Issued By":"SCB","Bank Account/Credit No./Point Code":"0493147974","Approval Code":"","Cheque Date":"","Cheque No":"","Cheque Branch":"","Reject Reason":"","AMC Code":"KSAM","PT":"N","IC":"4100","IC Branch":"400","Approver":"prakop.a","Last Update":"02/02/2023 08:22","Referral":"สุดคนึง หงส์ลดา","Settlement Bank":"SCB","Settlement Bank Account":"0593043240","Allotment Date":"01/02/2023","NAV Date":"01/02/2023","Investor Payment Instructor":"","Investor Payment Status":"","Fund Settlement Flag":"Y","Finnet Processing Type":"","Order Referral":"","Recurring Flag":"N","SA Recurring Order Reference No":"","Fee":0,"Withholding Tax":0,"VAT":0,"BCP":"N","Channel":"MKT","Reason to sell LTF/RMF":"","Allotted NAV":13.4019,"V.+ Order Ref. / AMC Order Ref.":"20230203201961"}];
// let test = new TranQuery(datas);
// console.log(test.getTransactionByDate("01/02/2023","10/02/2023"));