export class Transaction{
    private rawData: string = "";
    private transaction_id :string = "";
    private transaction_date: string ="";
    private account_id:string = "";
    private unitholder_id:string ="";
    private type:string ="";
    private customer_name:string ="";
    private transaction_type:string ="";
    private registrar_flag:string ="";
    private fund_code:string ="";
    private isin:string ="";
    private cut_off_time:string ="";
    private currency:number =0;
    private amount:number =0;
    private unit:number =0;
    private sell_all_unit:number =0;
    private status:number =0;
    private confirmed_amount:number =0;
    private confirmed_units:number =0;
    private effective_date:string ="";
    private settlement_date:string ="";
    private basket_transaction_d:string ="";
    private payment_type:string ="";
    private bank:string ="";
    private bank_account:string ="";
    private approval_code:string ="";
    private cheque_date:string ="";
    private cheque_no:string ="";
    private cheque_branch:string ="";
    private pay_in_bank:string ="";
    private pay_in_bank_account:string ="";
    private reject_reason:string ="";
    private order_reference:string ="";
    private amc_code:string ="";
    private pt:string ="";
    private ic:string ="";
    private team:string ="";
    private ic_branch:string ="";
    private approver:string ="";
    private last_update:string ="";
    private referral:string ="";
    private settlement_bank:string ="";
    private settlement_bank_accunt:string ="";
    private allotment_date:string ="";
    private nav_date:string ="";
    private investor_payment_intructor:string ="";
    private investor_payment_status:string ="";
    private fund_settlement_flag:string ="";
    private finnet_processing_tpe:string ="";
    private order_referral:string ="";
    private recurring_flag:string ="";
    private sa_recurring_order_eference_no:string ="";
    private auto_redeem_fund_coe:string ="";
    private fee:number =0;
    private withholding_tax:number =0;
    private vat:number =0;
    private bcp:string="";
    private channel:string="";
    private reason_to_sell:string ="";
    private allotted_nav:number =0;
    private amc_switching_orderreference_no:string ="";
    private order_ref:string ="";
    private xwt_reference_no:string ="";
    private counter_amc_code:string ="";
    private counter_fund_code:string ="";
    private counter_unitholder_d:string ="";
    private xwt_remark:string ="";

    public mappingField:any = {
                        "Transaction ID": "transaction_id", "Transaction Date": "transaction_date", "Account ID": "account_id"
                        , "Unitholder ID": "unitholder_id", "Type": "type", "Customer Name": "customer_name", "Transaction Type": "transaction_type"
                        , "Registrar Flag": "registrar_flag", "Fund Code": "fund_code", "ISIN": "isin", "Cut-off Time": "cut_off_time"
                        , "Currency": "currency", "Amount": "amount", "Unit": "unit", "Sell All Unit": "sell_all_unit", "Status": "status"
                        , "Confirmed Amount": "confirmed_amount", "Confirmed Units": "confirmed_units", "Effective Date": "effective_date"
                        , "Settlement Date": "settlement_date", "Payment Type": "payment_type", "Bank/Issued By": "bank"
                        , "Bank Account/Credit No./Point Code": "bank_account", "Approval Code": "approval_code", "Cheque Date": "cheque_date"
                        , "Cheque No": "cheque_no", "Cheque Branch": "cheque_branch"                        
                        , "Reject Reason": "reject_reason", "Order Reference": "order_reference", "AMC Code": "amc_code", "PT": "pt", "IC": "ic"
                        , "Team": "team", "IC Branch": "ic_branch", "Approver": "approver", "Last Update": "last_update", "Referral": "referral"
                        , "Settlement Bank": "settlement_bank", "Settlement Bank Account": "settlement_bank_account", "Allotment Date": "allotment_date"
                        , "NAV Date": "nav_date", "Investor Payment Instructor": "investor_payment_intructor", "Investor Payment Status": "investor_payment_status"
                        , "Fund Settlement Flag": "fund_settlement_flag", "Finnet Processing Type": "finnet_processing_type", "Order Referral": "order_referral"
                        , "Recurring Flag": "recurring_flag","SA Recurring Order Reference No":"sa_recurring_order_reference_no"
                        , "Auto Redeem Fund Code": "auto_redeem_fund_code", "Fee": "fee", "Withholding Tax": "withholding_tax"
                        , "VAT": "vat", "BCP": "bcp", "Channel": "channel", "Reason to sell LTF/RMF": "reason_to_sell", "Allotted NAV": "allotted_nav"
                        , "V.+ Order Ref. / AMC Order Ref.": "order_ref"
                        , "XWT Reference No": "xwt_reference_no", "Counter AMC Code": "counter_amc_code", "Counter Fund Code": "counter_fund_code"
                        , "Counter Unitholder ID": "counter_unitholder_d","Counter Unitholder Type":"counter_unitholder_type"
                        , "Counter Payment Type":"counter_payment_type","ADLs Fee":"adls_fee","Liquidity Fee":"liquidity_fee"
                        // , "Pay-in Bank": "pay_in_bank", "Pay-in Bank Account": "pay_in_bank_account", "XWT Remark": "xwt_remark"
                        // , "AMC Switching Order Reference No": "amc_switching_orderreference_no"
                    };
    //---------------- Method --------------------------//
    // public async query(SQL:string){
    //     // console.log(">>>>>>>>>>>>>>>>>>>>>>>Transaction.ts (Query)>>>>>>>>>>>>>>>>>>>>>>>>>");
    //     let result:any = "";
    //     try{
    //         result = await connection.query(SQL);
    //         // console.log(">>>>>>>>>>>>>>>>>>>>>>>(( Completed !! ))>>>>>>>>>>>>>>>>>>>>>>>>>");
    //       }catch (err) {
    //         console.error(err);
    //       }
    //     return result;
    // }
    // ----------- CRUD ----------------------------------//
    public async insert(datas:any){
        console.log(">>>>>>>>>>>>>>>>>>>>>>>Transaction.ts (INSERT)>>>>>>>>>>>>>>>>>>>>>>>>>");
        let result:number =0;
        let count = datas.length;
        console.log(count);
        let SQL = "";
        for(let i=0;i < count;i++){
            let data = datas[i];
            SQL += "INSERT INTO trasactions VALUES ("
                +"  '"+ data['Transaction Date'] +"', '"+data['Account ID']+"', '"+data['Unitholder ID']+"','"+ data['Type'] 
                +"','"+ data['Customer Name']+"' ,'"+data['Transaction Type']+"' ,'"+data['Registrar Flag']+"','"+ data['Fund Code'] +"','"+ data['ISIN'] 
                +"','"+ data['Cut-off Time'] +"', '"+ data['Currency']+"', '"+ data['Amount']+"', '"+ data['Unit']+"', '"+ data['Sell All Unit']
                +"','"+ data['Status'] +"', '"+ data['Confirmed Amount'] +"', '"+ data['Confirmed Units']+"', '"+ data['Effective Date']+"', '"+ data['Settlement Date']                
                +"','"+ data['Transaction ID'] 
                +"','"+ data['Payment Type'] +"', '"+ data['Bank/Issued By']+"', '"+ data['Bank Account/Credit No./Point Code']+"', '"+ data['Approval Code']
                +"','"+ data['Cheque Date'] +"', '"+ data['Cheque No'] +"', '"+ data['Cheque Branch']+"', '"+ data['Pay-in Bank']+"', '"+ data['Pay-in Bank Account']
                +"','"+ data['Reject Reason']+"', '"+ data['Order Reference']+"', '"+ data['AMC Code']+"','"+ data['PT'] +"', '"+ data['IC'] 
                +"','"+ data['IC Branch']+"', '"+ data['Approver']+"', '"+ data['Last Update']+"','"+ data['Referral'] 
                +"','"+ data['Settlement Bank'] +"', '"+ data['Settlement Bank Account']+"', '"+ data['Allotment Date']+"', '"+ data['NAV Date']
                +"','"+ data['Investor Payment Instructor'] +"', '"+ data['Investor Payment Status'] +"', '"+ data['Fund Settlement Flag']+"', '"+ data['Finnet Processing Type']+"', '"+ data['Order Referral']
                +"','"+ data['Recurring Flag'] +"', '"+ data['SA Recurring Order Reference No']+"', '"+ data['Auto Redeem Fund Code']+"', '"+ data['Fee']+"', '"+ data['Withholding Tax']
                +"','"+ data['VAT']+"','"+ data['BCP'] +"', '"+ data['Channel'] +"', '"+ data['Reason to sell LTF/RMF']+"', '"+ data['Allotted NAV']
                +"','"+ data['AMC Switching Order Reference No']+"','"+ data['V.+ Order Ref. / AMC Order Ref.'] +"', '"+ data['XWT Reference No'] +"', '"+ data['Counter AMC Code']+"', '"+ data['Counter Fund Code']
                +"','"+ data['XWT Remark']
                +"' );\n";
            // console.log(SQL);
        }
        
        // try{
        //     //result = await connection.query(SQL);
        //     console.log(">>>>>>>>>>>>>>>>>>>>>>>(( Completed !! ))>>>>>>>>>>>>>>>>>>>>>>>>>");
        //   }catch (err) {
        //     console.error(err);
        //   }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>(( Completed !! ))>>>>>>>>>>>>>>>>>>>>>>>>>");
        return result;
    }

    public setTransaction(tran:any):void{
        this.rawData = tran;
        this.setTransactionId(tran['Transaction ID']);
        this.setTransactionDate(tran['Transaction Date']);
        this.setAccountId(tran['Account ID']);
        this.setUnitholderId(tran['Unitholder ID']);
        this.setType(tran['Type']);
        this.setCustomerName(tran['Customer Name']);
        this.setTransactionType(tran['Transaction Type']);
        this.setRegistrarFlag(tran['Registrar Flag']);
        this.setFundCode(tran['Fund Code']);
        this.setIsin(tran['ISIN']);
        this.setCutOffTime(tran['Cut-off Time']);
        this.setCurrency(tran['Currency']);
        this.setAmount(tran['Amount']);
        this.setUnit(tran['Unit']);
        this.setSellAllUnit(tran['Sell All Unit']);
        this.setStatus(tran['Status']);
        this.setConfirmedAmount(tran['Confirmed Amount']);
        this.setConfirmedUnits(tran['Confirmed Units']);
        this.setEffectiveDate(tran['Effective Date']);
        this.setSettlementDate(tran['Settlement Date']);
        this.setPaymentType(tran['Payment Type']);
        this.setBank(tran['Bank/Issued By']);
        this.setBankAccount(tran['Bank Account/Credit No./Point Code']);
        this.setChequeDate(tran['Cheque Date']);
        this.setApprovalCode(tran['Approval Code']);
        this.setChequeDate(tran['Cheque Date']);
        this.setChequeNo(tran['Cheque No']);
        this.setChequeBranch(tran['Cheque Branch']);
        this.setRejectReason(tran['Reject Reason']);
        this.setAmcCode(tran['AMC Code']);
        this.setPt(tran['PT']);
        this.setIc(tran['IC']);
        this.setIcBranch(tran['IC Branch']);
        this.setApprover(tran['Approver']);
        this.setLastUpdate(tran['Last Update']);
        this.setReferral(tran['Referral']);
        this.setSettlementBank(tran['Settlement Bank']);
        this.setSettlementBankAccunt(tran['Settlement Bank Account']);
        this.setAllotmentDate(tran['Allotment Date']);
        this.setNavDate(tran['NAV Date']);
        this.setInvestorPaymentIntructor(tran['Investor Payment Instructor']);
        this.setInvestorPaymentStatus(tran['Investor Payment Status']);
        this.setFundSettlementFlag(tran['Fund Settlement Flag']);
        this.setFinnetProcessingTpe(tran['Finnet Processing Type']);
        this.setOrderReferral(tran['Order Referral']);
        this.setRecurringFlag(tran['Recurring Flag']);
        this.setSaRecurringOrderEferenceNo(tran['SA Recurring Order Reference No']);
        this.setFee(tran['Fee']);
        this.setWithholdingTax(tran['Withholding Tax']);
        this.setVat(tran['VAT']);
        this.setBcp(tran['BCP']);
        this.setChannel(tran['Channel']);
        this.setReasonToSell(tran['Reason to sell LTF/RMF']);
        this.setAllottedNav(tran['Allotted NAV']);
        this.setOrderRef(tran['V.+ Order Ref. / AMC Order Ref.']);
        this.setBasketTransactionD(tran['Basket Transaction ID']);
        this.setPayInBank(tran['Pay-in Bank']);
        this.setPayInBankAccount(tran['Pay-in Bank Account']);
    }

    // Getters
    public getSqlInsert():string{
        let SQL = "INSERT INTO transactions (";
        let value = "VALUES (";
        let attributes = this.getNameAttributes();
        let count = attributes.length;
        if(count>0){
            for(let i=0;i< count;i++){
                let attribute = attributes[i];
                let data = this.rawData[attribute];
                let att = this.mappingField[attribute];
                //let att = attribute;
                // console.log(att);
                if(att !== undefined){
                    // == DateTime
                    if(att ==='transaction_date' || att === 'last_update'){
                        data = "STR_TO_DATE('"+data+"','%d/%m/%Y %H:%i')";
                        value += " " + data +" ,";
                    // == Date
                    }else if(att ==='effective_date' || att ==='settlement_date'|| att ==='cheque_date' || 
                             att ==='allotment_date' || att === 'nav_date'){
                        if(data !== ''){
                            data = "STR_TO_DATE('"+data+"','%d/%m/%Y')";
                            value += " " + data +",";
                        }else{
                            value += " NULL,";
                        }
                    // == Decimal
                    }else if(att ==='amount' || att ==='unit' || att ==='confirmed_amount' || att ==='confirmed_units' || 
                             att === 'fee' || att ==='withholding_tax' || att ==='vat' || att ==='allotted_nav'
                             ){
                        //SQL += "`" + att + "` ,";
                        if(data ===''){
                            value += " NULL ,";
                        }else{
                            value += " " + data +",";
                        }
                    }else{
                        //SQL += "`" + att + "` ,";
                        value += "'" + data +"',";
                    }
                    SQL += "`" + att + "` ,";
                }
            }
            SQL = SQL.slice(0, -1) + " ) " + value.slice(0, -1) + " ); "; 
        }else{
            return "Err: Data Not Found!!;"
        }
        return SQL;
    }

    public getNameAttributes():any{
        return Object.getOwnPropertyNames(this.rawData);
    }

    public getAccountId(): string {
        return this.account_id;
    }

    public getUnitholderId(): string {
        return this.unitholder_id;
    }

    public getType(): string {
        return this.type;
    }

    public getCustomerName(): string {
        return this.customer_name;
    }

    public getTransactionType(): string {
        return this.transaction_type;
    }

    public getRegistrarFlag(): string {
        return this.registrar_flag;
    }

    public getFundCode(): string {
        return this.fund_code;
    }

    public getIsin(): string {
        return this.isin;
    }

    public getCutOffTime(): string {
        return this.cut_off_time;
    }

    public getCurrency(): number {
        return this.currency;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getUnit(): number {
        return this.unit;
    }

    public getSellAllUnit(): number {
        return this.sell_all_unit;
    }

    public getStatus(): number {
        return this.status;
    }

    public getConfirmedAmount(): number {
        return this.confirmed_amount;
    }

    public getConfirmedUnits(): number {
        return this.confirmed_units;
    }

    public getEffectiveDate(): string {
        return this.effective_date;
    }

    public getSettlementDate(): string {
        return this.settlement_date;
    }

    public getBasketTransactionD(): string {
        return this.basket_transaction_d;
    }

    public getPaymentType(): string {
        return this.payment_type;
    }

    public getBank(): string {
        return this.bank;
    }

    public getBankAccount(): string {
        return this.bank_account;
    }

    public getApprovalCode(): string {
        return this.approval_code;
    }

    public getChequeDate(): string {
        return this.cheque_date;
    }

    public getChequeNo(): string {
        return this.cheque_no;
    }

    public getChequeBranch(): string {
        return this.cheque_branch;
    }

    public getPayInBank(): string {
        return this.pay_in_bank;
    }

    public getPayInBankAccount(): string {
        return this.pay_in_bank_account;
    }

    public getRejectReason(): string {
        return this.reject_reason;
    }

    public getOrderReference(): string {
        return this.order_reference;
    }

    public getAmcCode(): string {
        return this.amc_code;
    }

    public getPt(): string {
        return this.pt;
    }

    public getIc(): string {
        return this.ic;
    }

    public getTeam(): string {
        return this.team;
    }

    public getIcBranch(): string {
        return this.ic_branch;
    }

    public getApprover(): string {
        return this.approver;
    }

    public getLastUpdate(): string {
        return this.last_update;
    }

    public getReferral(): string {
        return this.referral;
    }

    public getSettlementBank(): string {
        return this.settlement_bank;
    }

    public getSettlementBankAccunt(): string {
        return this.settlement_bank_accunt;
    }

    public getAllotmentDate(): string {
        return this.allotment_date;
    }

    public getNavDate(): string {
        return this.nav_date;
    }

    public getInvestorPaymentIntructor(): string {
        return this.investor_payment_intructor;
    }

    public getInvestorPaymentStatus(): string {
        return this.investor_payment_status;
    }

    public getFundSettlementFlag(): string {
        return this.fund_settlement_flag;
    }

    public getFinnetProcessingTpe(): string {
        return this.finnet_processing_tpe;
    }

    public getOrderReferral(): string {
        return this.order_referral;
    }

    public getRecurringFlag(): string {
        return this.recurring_flag;
    }

    public getSaRecurringOrderEferenceNo(): string {
        return this.sa_recurring_order_eference_no;
    }

    public getAutoRedeemFundCoe(): string {
        return this.auto_redeem_fund_coe;
    }

    public getFee(): number {
        return this.fee;
    }

    public getWithholdingTax(): number {
        return this.withholding_tax;
    }

    public getVat(): number {
        return this.vat;
    }

    public getBcp(): string {
        return this.bcp;
    }

    public getChannel(): string {
        return this.channel;
    }

    public getReasonToSell(): string {
        return this.reason_to_sell;
    }

    public getAllottedNav(): number {
        return this.allotted_nav;
    }

    public getAmcSwitchingOrderreferenceNo(): string {
        return this.amc_switching_orderreference_no;
    }

    public getOrderRef(): string {
        return this.order_ref;
    }

    public getXwtReferenceNo(): string {
        return this.xwt_reference_no;
    }

    public getCounterAmcCode(): string {
        return this.counter_amc_code;
    }

    public getCounterFundCode(): string {
        return this.counter_fund_code;
    }

    public getCounterUnitholderD(): string {
        return this.counter_unitholder_d;
    }

    public getXwtRemark(): string {
        return this.xwt_remark;
    }

    // Setters
    public setTransactionId(Id: string): void {
        this.transaction_id = Id;
    }
    public setTransactionDate(date: string): void {
        this.transaction_date = date;
    }

    public setAccountId(accountId: string): void {
        this.account_id = accountId;
    }

    public setUnitholderId(unitholderId: string): void {
        this.unitholder_id = unitholderId;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public setCustomerName(customerName: string): void {
        this.customer_name = customerName;
    }

    public setTransactionType(transactionType: string): void {
        this.transaction_type = transactionType;
    }

    public setRegistrarFlag(registrarFlag: string): void {
        this.registrar_flag = registrarFlag;
    }

    public setFundCode(fundCode: string): void {
        this.fund_code = fundCode;
    }

    public setIsin(isin: string): void {
        this.isin = isin;
    }

    public setCutOffTime(cutOffTime: string): void {
        this.cut_off_time = cutOffTime;
    }

    public setCurrency(currency: number): void {
        this.currency = currency;
    }

    public setAmount(amount: number): void {
        this.amount = amount;
    }

    public setUnit(unit: number): void {
        this.unit = unit;
    }

    public setSellAllUnit(sellAllUnit: number): void {
        this.sell_all_unit = sellAllUnit;
    }

    public setStatus(status: number): void {
        this.status = status;
    }

    public setConfirmedAmount(confirmedAmount: number): void {
        this.confirmed_amount = confirmedAmount;
    }

    public setConfirmedUnits(confirmedUnits: number): void {
        this.confirmed_units = confirmedUnits;
    }

    public setEffectiveDate(effectiveDate: string): void {
        this.effective_date = effectiveDate;
    }

    public setSettlementDate(settlementDate: string): void {
        this.settlement_date = settlementDate;
    }

    public setBasketTransactionD(basketTransactionD: string): void {
        this.basket_transaction_d = basketTransactionD;
    }

    public setPaymentType(paymentType: string): void {
        this.payment_type = paymentType;
    }

    public setBank(bank: string): void {
        this.bank = bank;
    }

    public setBankAccount(bankAccount: string): void {
        this.bank_account = bankAccount;
    }

    public setApprovalCode(approvalCode: string): void {
        this.approval_code = approvalCode;
    }

    public setChequeDate(chequeDate: string): void {
        this.cheque_date = chequeDate;
    }

    public setChequeNo(chequeNo: string): void {
        this.cheque_no = chequeNo;
    }

    public setChequeBranch(chequeBranch: string): void {
        this.cheque_branch = chequeBranch;
    }

    public setPayInBank(payInBank: string): void {
        this.pay_in_bank = payInBank;
    }

    public setPayInBankAccount(payInBankAccount: string): void {
        this.pay_in_bank_account = payInBankAccount;
    }

    public setRejectReason(rejectReason: string): void {
        this.reject_reason = rejectReason;
    }

    public setOrderReference(orderReference: string): void {
        this.order_reference = orderReference;
    }

    public setAmcCode(amcCode: string): void {
        this.amc_code = amcCode;
    }

    public setPt(pt: string): void {
        this.pt = pt;
    }

    public setIc(ic: string): void {
        this.ic = ic;
    }

    public setTeam(team: string): void {
        this.team = team;
    }

    public setIcBranch(icBranch: string): void {
        this.ic_branch = icBranch;
    }

    public setApprover(approver: string): void {
        this.approver = approver;
    }

    public setLastUpdate(lastUpdate: string): void {
        this.last_update = lastUpdate;
    }

    public setReferral(referral: string): void {
        this.referral = referral;
    }

    public setSettlementBank(settlementBank: string): void {
        this.settlement_bank = settlementBank;
    }

    public setSettlementBankAccunt(settlementBankAccunt: string): void {
        this.settlement_bank_accunt = settlementBankAccunt;
    }

    public setAllotmentDate(allotmentDate: string): void {
        this.allotment_date = allotmentDate;
    }

    public setNavDate(navDate: string): void {
        this.nav_date = navDate;
    }

    public setInvestorPaymentIntructor(investorPaymentIntructor: string): void {
        this.investor_payment_intructor = investorPaymentIntructor;
    }

    public setInvestorPaymentStatus(investorPaymentStatus: string): void {
        this.investor_payment_status = investorPaymentStatus;
    }

    public setFundSettlementFlag(fundSettlementFlag: string): void {
        this.fund_settlement_flag = fundSettlementFlag;
    }

    public setFinnetProcessingTpe(finnetProcessingTpe: string): void {
        this.finnet_processing_tpe = finnetProcessingTpe;
    }

    public setOrderReferral(orderReferral: string): void {
        this.order_referral = orderReferral;
    }

    public setRecurringFlag(recurringFlag: string): void {
        this.recurring_flag = recurringFlag;
    }

    public setSaRecurringOrderEferenceNo(
        saRecurringOrderEferenceNo: string
    ): void {
        this.sa_recurring_order_eference_no = saRecurringOrderEferenceNo;
    }

    public setAutoRedeemFundCoe(autoRedeemFundCoe: string): void {
        this.auto_redeem_fund_coe = autoRedeemFundCoe;
    }

    public setFee(fee: number): void {
        this.fee = fee;
    }

    public setWithholdingTax(withholdingTax: number): void {
        this.withholding_tax = withholdingTax;
    }

    public setVat(vat: number): void {
        this.vat = vat;
    }

    public setBcp(bcp: string): void {
        this.bcp = bcp;
    }

    public setChannel(channel: string): void {
        this.channel = channel;
    }

    public setReasonToSell(reasonToSell: string): void {
        this.reason_to_sell = reasonToSell;
    }

    public setAllottedNav(allottedNav: number): void {
        this.allotted_nav = allottedNav;
    }

    public setAmcSwitchingOrderreferenceNo(
        amcSwitchingOrderreferenceNo: string
    ): void {
        this.amc_switching_orderreference_no = amcSwitchingOrderreferenceNo;
    }

    public setOrderRef(orderRef: string): void {
        this.order_ref = orderRef;
    }

    public setXwtReferenceNo(xwtReferenceNo: string): void {
        this.xwt_reference_no = xwtReferenceNo;
    }

    public setCounterAmcCode(counterAmcCode: string): void {
        this.counter_amc_code = counterAmcCode;
    }

    public setCounterFundCode(counterFundCode: string): void {
        this.counter_fund_code = counterFundCode;
    }

    public setCounterUnitholderD(counterUnitholderD: string): void {
        this.counter_unitholder_d = counterUnitholderD;
    }

    public setXwtRemark(xwtRemark: string): void {
        this.xwt_remark = xwtRemark;
    }

}

//a.insert(datas);
//let sql = "select citizenID from customers where citizenID='3100601766923'"
// a.insert(datas).then(function(result) {
//     console.log(result) // "Some User token"
//  })
