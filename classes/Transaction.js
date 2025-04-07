"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
var Transaction = /** @class */ (function () {
    function Transaction() {
        this.rawData = "";
        this.transaction_id = "";
        this.transaction_date = "";
        this.account_id = "";
        this.unitholder_id = "";
        this.type = "";
        this.customer_name = "";
        this.transaction_type = "";
        this.registrar_flag = "";
        this.fund_code = "";
        this.isin = "";
        this.cut_off_time = "";
        this.currency = 0;
        this.amount = 0;
        this.unit = 0;
        this.sell_all_unit = 0;
        this.status = 0;
        this.confirmed_amount = 0;
        this.confirmed_units = 0;
        this.effective_date = "";
        this.settlement_date = "";
        this.basket_transaction_d = "";
        this.payment_type = "";
        this.bank = "";
        this.bank_account = "";
        this.approval_code = "";
        this.cheque_date = "";
        this.cheque_no = "";
        this.cheque_branch = "";
        this.pay_in_bank = "";
        this.pay_in_bank_account = "";
        this.reject_reason = "";
        this.order_reference = "";
        this.amc_code = "";
        this.pt = "";
        this.ic = "";
        this.team = "";
        this.ic_branch = "";
        this.approver = "";
        this.last_update = "";
        this.referral = "";
        this.settlement_bank = "";
        this.settlement_bank_accunt = "";
        this.allotment_date = "";
        this.nav_date = "";
        this.investor_payment_intructor = "";
        this.investor_payment_status = "";
        this.fund_settlement_flag = "";
        this.finnet_processing_tpe = "";
        this.order_referral = "";
        this.recurring_flag = "";
        this.sa_recurring_order_eference_no = "";
        this.auto_redeem_fund_coe = "";
        this.fee = 0;
        this.withholding_tax = 0;
        this.vat = 0;
        this.bcp = "";
        this.channel = "";
        this.reason_to_sell = "";
        this.allotted_nav = 0;
        this.amc_switching_orderreference_no = "";
        this.order_ref = "";
        this.xwt_reference_no = "";
        this.counter_amc_code = "";
        this.counter_fund_code = "";
        this.counter_unitholder_d = "";
        this.xwt_remark = "";
        this.mappingField = {
            "Transaction ID": "transaction_id", "Transaction Date": "transaction_date", "Account ID": "account_id",
            "Unitholder ID": "unitholder_id", "Type": "type", "Customer Name": "customer_name", "Transaction Type": "transaction_type",
            "Registrar Flag": "registrar_flag", "Fund Code": "fund_code", "ISIN": "isin", "Cut-off Time": "cut_off_time",
            "Currency": "currency", "Amount": "amount", "Unit": "unit", "Sell All Unit": "sell_all_unit", "Status": "status",
            "Confirmed Amount": "confirmed_amount", "Confirmed Units": "confirmed_units", "Effective Date": "effective_date",
            "Settlement Date": "settlement_date", "Payment Type": "payment_type", "Bank/Issued By": "bank",
            "Bank Account/Credit No./Point Code": "bank_account", "Approval Code": "approval_code", "Cheque Date": "cheque_date",
            "Cheque No": "cheque_no", "Cheque Branch": "cheque_branch",
            "Reject Reason": "reject_reason", "Order Reference": "order_reference", "AMC Code": "amc_code", "PT": "pt", "IC": "ic",
            "Team": "team", "IC Branch": "ic_branch", "Approver": "approver", "Last Update": "last_update", "Referral": "referral",
            "Settlement Bank": "settlement_bank", "Settlement Bank Account": "settlement_bank_account", "Allotment Date": "allotment_date",
            "NAV Date": "nav_date", "Investor Payment Instructor": "investor_payment_intructor", "Investor Payment Status": "investor_payment_status",
            "Fund Settlement Flag": "fund_settlement_flag", "Finnet Processing Type": "finnet_processing_type", "Order Referral": "order_referral",
            "Recurring Flag": "recurring_flag", "SA Recurring Order Reference No": "sa_recurring_order_reference_no",
            "Auto Redeem Fund Code": "auto_redeem_fund_code", "Fee": "fee", "Withholding Tax": "withholding_tax",
            "VAT": "vat", "BCP": "bcp", "Channel": "channel", "Reason to sell LTF/RMF": "reason_to_sell", "Allotted NAV": "allotted_nav",
            "V.+ Order Ref. / AMC Order Ref.": "order_ref",
            "XWT Reference No": "xwt_reference_no", "Counter AMC Code": "counter_amc_code", "Counter Fund Code": "counter_fund_code",
            "Counter Unitholder ID": "counter_unitholder_d", "Counter Unitholder Type": "counter_unitholder_type",
            "Counter Payment Type": "counter_payment_type", "ADLs Fee": "adls_fee", "Liquidity Fee": "liquidity_fee"
            // , "Pay-in Bank": "pay_in_bank", "Pay-in Bank Account": "pay_in_bank_account", "XWT Remark": "xwt_remark"
            // , "AMC Switching Order Reference No": "amc_switching_orderreference_no"
        };
    }
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
    Transaction.prototype.insert = function (datas) {
        return __awaiter(this, void 0, void 0, function () {
            var result, count, SQL, i, data;
            return __generator(this, function (_a) {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>Transaction.ts (INSERT)>>>>>>>>>>>>>>>>>>>>>>>>>");
                result = 0;
                count = datas.length;
                console.log(count);
                SQL = "";
                for (i = 0; i < count; i++) {
                    data = datas[i];
                    SQL += "INSERT INTO trasactions VALUES ("
                        + "  '" + data['Transaction Date'] + "', '" + data['Account ID'] + "', '" + data['Unitholder ID'] + "','" + data['Type']
                        + "','" + data['Customer Name'] + "' ,'" + data['Transaction Type'] + "' ,'" + data['Registrar Flag'] + "','" + data['Fund Code'] + "','" + data['ISIN']
                        + "','" + data['Cut-off Time'] + "', '" + data['Currency'] + "', '" + data['Amount'] + "', '" + data['Unit'] + "', '" + data['Sell All Unit']
                        + "','" + data['Status'] + "', '" + data['Confirmed Amount'] + "', '" + data['Confirmed Units'] + "', '" + data['Effective Date'] + "', '" + data['Settlement Date']
                        + "','" + data['Transaction ID']
                        + "','" + data['Payment Type'] + "', '" + data['Bank/Issued By'] + "', '" + data['Bank Account/Credit No./Point Code'] + "', '" + data['Approval Code']
                        + "','" + data['Cheque Date'] + "', '" + data['Cheque No'] + "', '" + data['Cheque Branch'] + "', '" + data['Pay-in Bank'] + "', '" + data['Pay-in Bank Account']
                        + "','" + data['Reject Reason'] + "', '" + data['Order Reference'] + "', '" + data['AMC Code'] + "','" + data['PT'] + "', '" + data['IC']
                        + "','" + data['IC Branch'] + "', '" + data['Approver'] + "', '" + data['Last Update'] + "','" + data['Referral']
                        + "','" + data['Settlement Bank'] + "', '" + data['Settlement Bank Account'] + "', '" + data['Allotment Date'] + "', '" + data['NAV Date']
                        + "','" + data['Investor Payment Instructor'] + "', '" + data['Investor Payment Status'] + "', '" + data['Fund Settlement Flag'] + "', '" + data['Finnet Processing Type'] + "', '" + data['Order Referral']
                        + "','" + data['Recurring Flag'] + "', '" + data['SA Recurring Order Reference No'] + "', '" + data['Auto Redeem Fund Code'] + "', '" + data['Fee'] + "', '" + data['Withholding Tax']
                        + "','" + data['VAT'] + "','" + data['BCP'] + "', '" + data['Channel'] + "', '" + data['Reason to sell LTF/RMF'] + "', '" + data['Allotted NAV']
                        + "','" + data['AMC Switching Order Reference No'] + "','" + data['V.+ Order Ref. / AMC Order Ref.'] + "', '" + data['XWT Reference No'] + "', '" + data['Counter AMC Code'] + "', '" + data['Counter Fund Code']
                        + "','" + data['XWT Remark']
                        + "' );\n";
                    // console.log(SQL);
                }
                // try{
                //     //result = await connection.query(SQL);
                //     console.log(">>>>>>>>>>>>>>>>>>>>>>>(( Completed !! ))>>>>>>>>>>>>>>>>>>>>>>>>>");
                //   }catch (err) {
                //     console.error(err);
                //   }
                console.log(">>>>>>>>>>>>>>>>>>>>>>>(( Completed !! ))>>>>>>>>>>>>>>>>>>>>>>>>>");
                return [2 /*return*/, result];
            });
        });
    };
    Transaction.prototype.setTransaction = function (tran) {
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
    };
    // Getters
    Transaction.prototype.getSqlInsert = function () {
        var SQL = "INSERT INTO transactions (";
        var value = "VALUES (";
        var attributes = this.getNameAttributes();
        var count = attributes.length;
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var attribute = attributes[i];
                var data = this.rawData[attribute];
                var att = this.mappingField[attribute];
                //let att = attribute;
                // console.log(att);
                if (att !== undefined) {
                    // == DateTime
                    if (att === 'transaction_date' || att === 'last_update') {
                        data = "STR_TO_DATE('" + data + "','%d/%m/%Y %H:%i')";
                        value += " " + data + " ,";
                        // == Date
                    }
                    else if (att === 'effective_date' || att === 'settlement_date' || att === 'cheque_date' ||
                        att === 'allotment_date' || att === 'nav_date') {
                        if (data !== '') {
                            data = "STR_TO_DATE('" + data + "','%d/%m/%Y')";
                            value += " " + data + ",";
                        }
                        else {
                            value += " NULL,";
                        }
                        // == Decimal
                    }
                    else if (att === 'amount' || att === 'unit' || att === 'confirmed_amount' || att === 'confirmed_units' ||
                        att === 'fee' || att === 'withholding_tax' || att === 'vat' || att === 'allotted_nav') {
                        //SQL += "`" + att + "` ,";
                        if (data === '') {
                            value += " NULL ,";
                        }
                        else {
                            value += " " + data + ",";
                        }
                    }
                    else {
                        //SQL += "`" + att + "` ,";
                        value += "'" + data + "',";
                    }
                    SQL += "`" + att + "` ,";
                }
            }
            SQL = SQL.slice(0, -1) + " ) " + value.slice(0, -1) + " ); ";
        }
        else {
            return "Err: Data Not Found!!;";
        }
        return SQL;
    };
    Transaction.prototype.getNameAttributes = function () {
        return Object.getOwnPropertyNames(this.rawData);
    };
    Transaction.prototype.getAccountId = function () {
        return this.account_id;
    };
    Transaction.prototype.getUnitholderId = function () {
        return this.unitholder_id;
    };
    Transaction.prototype.getType = function () {
        return this.type;
    };
    Transaction.prototype.getCustomerName = function () {
        return this.customer_name;
    };
    Transaction.prototype.getTransactionType = function () {
        return this.transaction_type;
    };
    Transaction.prototype.getRegistrarFlag = function () {
        return this.registrar_flag;
    };
    Transaction.prototype.getFundCode = function () {
        return this.fund_code;
    };
    Transaction.prototype.getIsin = function () {
        return this.isin;
    };
    Transaction.prototype.getCutOffTime = function () {
        return this.cut_off_time;
    };
    Transaction.prototype.getCurrency = function () {
        return this.currency;
    };
    Transaction.prototype.getAmount = function () {
        return this.amount;
    };
    Transaction.prototype.getUnit = function () {
        return this.unit;
    };
    Transaction.prototype.getSellAllUnit = function () {
        return this.sell_all_unit;
    };
    Transaction.prototype.getStatus = function () {
        return this.status;
    };
    Transaction.prototype.getConfirmedAmount = function () {
        return this.confirmed_amount;
    };
    Transaction.prototype.getConfirmedUnits = function () {
        return this.confirmed_units;
    };
    Transaction.prototype.getEffectiveDate = function () {
        return this.effective_date;
    };
    Transaction.prototype.getSettlementDate = function () {
        return this.settlement_date;
    };
    Transaction.prototype.getBasketTransactionD = function () {
        return this.basket_transaction_d;
    };
    Transaction.prototype.getPaymentType = function () {
        return this.payment_type;
    };
    Transaction.prototype.getBank = function () {
        return this.bank;
    };
    Transaction.prototype.getBankAccount = function () {
        return this.bank_account;
    };
    Transaction.prototype.getApprovalCode = function () {
        return this.approval_code;
    };
    Transaction.prototype.getChequeDate = function () {
        return this.cheque_date;
    };
    Transaction.prototype.getChequeNo = function () {
        return this.cheque_no;
    };
    Transaction.prototype.getChequeBranch = function () {
        return this.cheque_branch;
    };
    Transaction.prototype.getPayInBank = function () {
        return this.pay_in_bank;
    };
    Transaction.prototype.getPayInBankAccount = function () {
        return this.pay_in_bank_account;
    };
    Transaction.prototype.getRejectReason = function () {
        return this.reject_reason;
    };
    Transaction.prototype.getOrderReference = function () {
        return this.order_reference;
    };
    Transaction.prototype.getAmcCode = function () {
        return this.amc_code;
    };
    Transaction.prototype.getPt = function () {
        return this.pt;
    };
    Transaction.prototype.getIc = function () {
        return this.ic;
    };
    Transaction.prototype.getTeam = function () {
        return this.team;
    };
    Transaction.prototype.getIcBranch = function () {
        return this.ic_branch;
    };
    Transaction.prototype.getApprover = function () {
        return this.approver;
    };
    Transaction.prototype.getLastUpdate = function () {
        return this.last_update;
    };
    Transaction.prototype.getReferral = function () {
        return this.referral;
    };
    Transaction.prototype.getSettlementBank = function () {
        return this.settlement_bank;
    };
    Transaction.prototype.getSettlementBankAccunt = function () {
        return this.settlement_bank_accunt;
    };
    Transaction.prototype.getAllotmentDate = function () {
        return this.allotment_date;
    };
    Transaction.prototype.getNavDate = function () {
        return this.nav_date;
    };
    Transaction.prototype.getInvestorPaymentIntructor = function () {
        return this.investor_payment_intructor;
    };
    Transaction.prototype.getInvestorPaymentStatus = function () {
        return this.investor_payment_status;
    };
    Transaction.prototype.getFundSettlementFlag = function () {
        return this.fund_settlement_flag;
    };
    Transaction.prototype.getFinnetProcessingTpe = function () {
        return this.finnet_processing_tpe;
    };
    Transaction.prototype.getOrderReferral = function () {
        return this.order_referral;
    };
    Transaction.prototype.getRecurringFlag = function () {
        return this.recurring_flag;
    };
    Transaction.prototype.getSaRecurringOrderEferenceNo = function () {
        return this.sa_recurring_order_eference_no;
    };
    Transaction.prototype.getAutoRedeemFundCoe = function () {
        return this.auto_redeem_fund_coe;
    };
    Transaction.prototype.getFee = function () {
        return this.fee;
    };
    Transaction.prototype.getWithholdingTax = function () {
        return this.withholding_tax;
    };
    Transaction.prototype.getVat = function () {
        return this.vat;
    };
    Transaction.prototype.getBcp = function () {
        return this.bcp;
    };
    Transaction.prototype.getChannel = function () {
        return this.channel;
    };
    Transaction.prototype.getReasonToSell = function () {
        return this.reason_to_sell;
    };
    Transaction.prototype.getAllottedNav = function () {
        return this.allotted_nav;
    };
    Transaction.prototype.getAmcSwitchingOrderreferenceNo = function () {
        return this.amc_switching_orderreference_no;
    };
    Transaction.prototype.getOrderRef = function () {
        return this.order_ref;
    };
    Transaction.prototype.getXwtReferenceNo = function () {
        return this.xwt_reference_no;
    };
    Transaction.prototype.getCounterAmcCode = function () {
        return this.counter_amc_code;
    };
    Transaction.prototype.getCounterFundCode = function () {
        return this.counter_fund_code;
    };
    Transaction.prototype.getCounterUnitholderD = function () {
        return this.counter_unitholder_d;
    };
    Transaction.prototype.getXwtRemark = function () {
        return this.xwt_remark;
    };
    // Setters
    Transaction.prototype.setTransactionId = function (Id) {
        this.transaction_id = Id;
    };
    Transaction.prototype.setTransactionDate = function (date) {
        this.transaction_date = date;
    };
    Transaction.prototype.setAccountId = function (accountId) {
        this.account_id = accountId;
    };
    Transaction.prototype.setUnitholderId = function (unitholderId) {
        this.unitholder_id = unitholderId;
    };
    Transaction.prototype.setType = function (type) {
        this.type = type;
    };
    Transaction.prototype.setCustomerName = function (customerName) {
        this.customer_name = customerName;
    };
    Transaction.prototype.setTransactionType = function (transactionType) {
        this.transaction_type = transactionType;
    };
    Transaction.prototype.setRegistrarFlag = function (registrarFlag) {
        this.registrar_flag = registrarFlag;
    };
    Transaction.prototype.setFundCode = function (fundCode) {
        this.fund_code = fundCode;
    };
    Transaction.prototype.setIsin = function (isin) {
        this.isin = isin;
    };
    Transaction.prototype.setCutOffTime = function (cutOffTime) {
        this.cut_off_time = cutOffTime;
    };
    Transaction.prototype.setCurrency = function (currency) {
        this.currency = currency;
    };
    Transaction.prototype.setAmount = function (amount) {
        this.amount = amount;
    };
    Transaction.prototype.setUnit = function (unit) {
        this.unit = unit;
    };
    Transaction.prototype.setSellAllUnit = function (sellAllUnit) {
        this.sell_all_unit = sellAllUnit;
    };
    Transaction.prototype.setStatus = function (status) {
        this.status = status;
    };
    Transaction.prototype.setConfirmedAmount = function (confirmedAmount) {
        this.confirmed_amount = confirmedAmount;
    };
    Transaction.prototype.setConfirmedUnits = function (confirmedUnits) {
        this.confirmed_units = confirmedUnits;
    };
    Transaction.prototype.setEffectiveDate = function (effectiveDate) {
        this.effective_date = effectiveDate;
    };
    Transaction.prototype.setSettlementDate = function (settlementDate) {
        this.settlement_date = settlementDate;
    };
    Transaction.prototype.setBasketTransactionD = function (basketTransactionD) {
        this.basket_transaction_d = basketTransactionD;
    };
    Transaction.prototype.setPaymentType = function (paymentType) {
        this.payment_type = paymentType;
    };
    Transaction.prototype.setBank = function (bank) {
        this.bank = bank;
    };
    Transaction.prototype.setBankAccount = function (bankAccount) {
        this.bank_account = bankAccount;
    };
    Transaction.prototype.setApprovalCode = function (approvalCode) {
        this.approval_code = approvalCode;
    };
    Transaction.prototype.setChequeDate = function (chequeDate) {
        this.cheque_date = chequeDate;
    };
    Transaction.prototype.setChequeNo = function (chequeNo) {
        this.cheque_no = chequeNo;
    };
    Transaction.prototype.setChequeBranch = function (chequeBranch) {
        this.cheque_branch = chequeBranch;
    };
    Transaction.prototype.setPayInBank = function (payInBank) {
        this.pay_in_bank = payInBank;
    };
    Transaction.prototype.setPayInBankAccount = function (payInBankAccount) {
        this.pay_in_bank_account = payInBankAccount;
    };
    Transaction.prototype.setRejectReason = function (rejectReason) {
        this.reject_reason = rejectReason;
    };
    Transaction.prototype.setOrderReference = function (orderReference) {
        this.order_reference = orderReference;
    };
    Transaction.prototype.setAmcCode = function (amcCode) {
        this.amc_code = amcCode;
    };
    Transaction.prototype.setPt = function (pt) {
        this.pt = pt;
    };
    Transaction.prototype.setIc = function (ic) {
        this.ic = ic;
    };
    Transaction.prototype.setTeam = function (team) {
        this.team = team;
    };
    Transaction.prototype.setIcBranch = function (icBranch) {
        this.ic_branch = icBranch;
    };
    Transaction.prototype.setApprover = function (approver) {
        this.approver = approver;
    };
    Transaction.prototype.setLastUpdate = function (lastUpdate) {
        this.last_update = lastUpdate;
    };
    Transaction.prototype.setReferral = function (referral) {
        this.referral = referral;
    };
    Transaction.prototype.setSettlementBank = function (settlementBank) {
        this.settlement_bank = settlementBank;
    };
    Transaction.prototype.setSettlementBankAccunt = function (settlementBankAccunt) {
        this.settlement_bank_accunt = settlementBankAccunt;
    };
    Transaction.prototype.setAllotmentDate = function (allotmentDate) {
        this.allotment_date = allotmentDate;
    };
    Transaction.prototype.setNavDate = function (navDate) {
        this.nav_date = navDate;
    };
    Transaction.prototype.setInvestorPaymentIntructor = function (investorPaymentIntructor) {
        this.investor_payment_intructor = investorPaymentIntructor;
    };
    Transaction.prototype.setInvestorPaymentStatus = function (investorPaymentStatus) {
        this.investor_payment_status = investorPaymentStatus;
    };
    Transaction.prototype.setFundSettlementFlag = function (fundSettlementFlag) {
        this.fund_settlement_flag = fundSettlementFlag;
    };
    Transaction.prototype.setFinnetProcessingTpe = function (finnetProcessingTpe) {
        this.finnet_processing_tpe = finnetProcessingTpe;
    };
    Transaction.prototype.setOrderReferral = function (orderReferral) {
        this.order_referral = orderReferral;
    };
    Transaction.prototype.setRecurringFlag = function (recurringFlag) {
        this.recurring_flag = recurringFlag;
    };
    Transaction.prototype.setSaRecurringOrderEferenceNo = function (saRecurringOrderEferenceNo) {
        this.sa_recurring_order_eference_no = saRecurringOrderEferenceNo;
    };
    Transaction.prototype.setAutoRedeemFundCoe = function (autoRedeemFundCoe) {
        this.auto_redeem_fund_coe = autoRedeemFundCoe;
    };
    Transaction.prototype.setFee = function (fee) {
        this.fee = fee;
    };
    Transaction.prototype.setWithholdingTax = function (withholdingTax) {
        this.withholding_tax = withholdingTax;
    };
    Transaction.prototype.setVat = function (vat) {
        this.vat = vat;
    };
    Transaction.prototype.setBcp = function (bcp) {
        this.bcp = bcp;
    };
    Transaction.prototype.setChannel = function (channel) {
        this.channel = channel;
    };
    Transaction.prototype.setReasonToSell = function (reasonToSell) {
        this.reason_to_sell = reasonToSell;
    };
    Transaction.prototype.setAllottedNav = function (allottedNav) {
        this.allotted_nav = allottedNav;
    };
    Transaction.prototype.setAmcSwitchingOrderreferenceNo = function (amcSwitchingOrderreferenceNo) {
        this.amc_switching_orderreference_no = amcSwitchingOrderreferenceNo;
    };
    Transaction.prototype.setOrderRef = function (orderRef) {
        this.order_ref = orderRef;
    };
    Transaction.prototype.setXwtReferenceNo = function (xwtReferenceNo) {
        this.xwt_reference_no = xwtReferenceNo;
    };
    Transaction.prototype.setCounterAmcCode = function (counterAmcCode) {
        this.counter_amc_code = counterAmcCode;
    };
    Transaction.prototype.setCounterFundCode = function (counterFundCode) {
        this.counter_fund_code = counterFundCode;
    };
    Transaction.prototype.setCounterUnitholderD = function (counterUnitholderD) {
        this.counter_unitholder_d = counterUnitholderD;
    };
    Transaction.prototype.setXwtRemark = function (xwtRemark) {
        this.xwt_remark = xwtRemark;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
//a.insert(datas);
//let sql = "select citizenID from customers where citizenID='3100601766923'"
// a.insert(datas).then(function(result) {
//     console.log(result) // "Some User token"
//  })
