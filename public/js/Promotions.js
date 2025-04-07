var Promotions = /** @class */ (function () {
    // private amcSharing:any;
    function Promotions(ic, datas) {
        this.name = '';
        this.ic = '';
        this.AMC_Sharing100 = ["KTAM", "EASTSPRING", "KASSET", "ASSETFUND"];
        this.sharingRate = 0.7;
        this.performnace = 0;
        this.ic = ic;
        this.datas = datas;
    }
    Promotions.prototype.step_0 = function (rows) {
        //แยกข้อมูลที่เป็น SWI SUB และที่มีค่า FEE
        var group = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var fee = 0;
            if (row.fee !== undefined && row.fee !== null) {
                fee = parseFloat(row.fee.replace(/,/g, ''));
            }
            if (fee > 0) {
                group.push(row);
            }
        }
        return group;
    };
    Promotions.prototype.step_1 = function (rows) {
        // จัดกลุ่ม Transaction ให้อยู่ใน บลจ ที่ sharing 100 
        var sharing_100 = [];
        var sharing_70 = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var amc_code = row.amc_code;
            // ตรวจสอบว่าค่า amc_code อยู่ใน AMC_Sharing100 หรือไม่
            var isSharing100 = false;
            for (var j = 0; j < this.AMC_Sharing100.length; j++) {
                if (amc_code == this.AMC_Sharing100[j]) {
                    isSharing100 = true;
                    break; // หยุด loop เมื่อเจอ match
                }
            }
            // ถ้าอยู่ใน AMC_Sharing100 ให้ใส่ sharing_100
            if (isSharing100) {
                sharing_100.push(row);
            }
            else {
                // ถ้าไม่อยู่ใน AMC_Sharing100 ให้ใส่ sharing_70
                sharing_70.push(row);
            }
        }
        return { 'sharing100': sharing_100, 'sharing70': sharing_70 };
    };
    Promotions.prototype.step_2 = function (rows) {
        // console.log(rows);
        // console.log(this.amcSharing);
        var sumAmount_150 = 0;
        var sumAmount_125 = 0;
        var sumAmount_Other = 0;
        var sumFee_150 = 0;
        var sumFee_125 = 0;
        var sumWithHoldingTax = 0;
        var feeAfterWithholdingTax = 0;
        var feeAfterWithholdingTaxAndSharing = 0;
        var wccWH125 = 0;
        var wccWH150 = 0;
        var Fee_125 = [];
        var Fee_150 = [];
        var Fee_Other = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var fee = parseFloat(row.fee.replace(/,/g, ''));
            var amount = parseFloat(row.confirmed_amount.replace(/,/g, ''));
            var fee_rate = fee / amount * 100;
            var withHoldingTax = fee * 0.03;
            if (fee_rate >= 1.15 && fee_rate <= 1.20) {
                sumAmount_125 += amount;
                sumFee_125 += fee;
                wccWH125 += withHoldingTax;
                Fee_125.push(row);
            }
            else if (fee_rate >= 1.37 && fee_rate <= 1.55) {
                sumAmount_150 += amount;
                sumFee_150 += fee;
                wccWH150 += withHoldingTax;
                Fee_150.push(row);
            }
            else {
                sumAmount_Other += amount;
                Fee_Other.push(row);
            }
            sumWithHoldingTax += wccWH125 + wccWH150;
            // const sharing = this.amcSharing.find(item => item.fund_code === row.fund_code)?.sharing ||1;
            feeAfterWithholdingTax += (fee - withHoldingTax);
        }
        feeAfterWithholdingTaxAndSharing = feeAfterWithholdingTax * 0.3;
        var reward_125 = Math.floor(sumAmount_125 / 1000000) * 2500;
        var reward_150 = Math.floor(sumAmount_150 / 1000000) * 3500;
        var rate = {
            'sumAmount_150': sumAmount_150,
            'sumAmount_125': sumAmount_125,
            'sumAmount_Other': sumAmount_Other,
            'sumFee125': sumFee_125,
            'sumFee150': sumFee_150,
            'reward_125': reward_125,
            'reward_150': reward_150,
            'total_reward': (reward_125 + reward_150),
            'feeAfterWithholdingTax': feeAfterWithholdingTax,
            'feeAfterWithholdingTaxAndSharing': feeAfterWithholdingTaxAndSharing
        };
        if (this.performnace <= 0) {
            rate.total_reward = 0;
        }
        return rate;
    };
    // สำหรับ Promotion Other นอกเหนือจาก 4 บลจ sharing 70%
    Promotions.prototype.step_3 = function (rows) {
        var sumAmount = 0;
        var sumFee = 0;
        var sumWithHoldingTax = 0;
        var feeAfterWithholdingTax = 0;
        var feeAfterWithholdingTaxAndSharing = 0;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var fee = parseFloat(row.fee.replace(/,/g, ''));
            var amount = parseFloat(row.confirmed_amount.replace(/,/g, ''));
            var withHoldingTax = fee * 0.03;
            sumAmount += amount;
            sumFee += fee;
            sumWithHoldingTax += withHoldingTax;
        }
        feeAfterWithholdingTax = sumFee - sumWithHoldingTax;
        feeAfterWithholdingTaxAndSharing = feeAfterWithholdingTax * 0.7;
        return feeAfterWithholdingTaxAndSharing;
    };
    Promotions.prototype.setUserPerformance = function (perf) {
        this.performnace = perf;
    };
    Promotions.prototype.getPromotion = function () {
        var step_0 = this.step_0(this.datas);
        var step_1 = this.step_1(step_0);
        var step_2 = this.step_2(step_1.sharing100);
        step_2.revenue = step_2.feeAfterWithholdingTax + this.step_3(step_1.sharing70);
        return step_2;
    };
    return Promotions;
}());
