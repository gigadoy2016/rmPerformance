export class AssetCompany{
    private columnName:any = {"Fund Name":"fund_name","Fund Code":"fund_code","Fund Management":"amc_name","Front End Fee (Selling fee)":"selling_fee","percentage":"sharing"};
    private amcData = [];

    constructor(datas:any){
        this.amcData = datas;
    }

    public getColumnName():string{
        let SQL:string = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'wcc' AND TABLE_NAME = 'asset_company';";
        return SQL;
    }
    public getNameAttributes(data:any):any{
        return Object.getOwnPropertyNames(data);
    }
}