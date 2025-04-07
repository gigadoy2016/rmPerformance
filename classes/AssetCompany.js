"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetCompany = void 0;
class AssetCompany {
    constructor(datas) {
        this.columnName = { "Fund Name": "fund_name", "Fund Code": "fund_code", "Fund Management": "amc_name", "Front End Fee (Selling fee)": "selling_fee", "percentage": "sharing" };
        this.amcData = [];
        this.amcData = datas;
    }
    getColumnName() {
        let SQL = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'wcc' AND TABLE_NAME = 'asset_company';";
        return SQL;
    }
    getNameAttributes(data) {
        return Object.getOwnPropertyNames(data);
    }
}
exports.AssetCompany = AssetCompany;
