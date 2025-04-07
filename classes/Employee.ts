import { dbConnection,dbConnJob } from '../config/dbConfig';
import {  Debug } from './Debug';
export class Employee{
    private debug = new Debug(true,"Class Employee.ts");
    
    public async getEmployeeByID(id:string){
        // console.log("Class Employee:");
        this.debug.Log("getEmployeeByID:" + id);
        const SQL = "SELECT * FROM employees WHERE ic_code ='"+id+"';"
        console.log(SQL);
        let data;
        try{
            data =await dbConnection.query(SQL);
            let approver =await this.getApprover(id);
            // console.log(approver[0]);
            if(approver.length>0){
                data[0][0].approver = approver;
            }
            // console.log(data[0][0]);
            return data[0];
        }catch(err) {
            console.log(err);
        }
    }

    public async getEmployee(id:string){
        this.debug.Log("getEmployee:");
        const SQL = "SELECT * FROM employees WHERE ic_code ='"+id+"';"
        console.log(SQL);
        let data;
        try{
            data =await dbConnection.query(SQL);
            return data[0];
        }catch(err) {
            console.log(err);
        }
    }

    public async getApprover(ic_code:string){
        this.debug.Log("getApprover by "+ic_code+ "");
        const SQL = "SELECT user_id , approver_id ,permission  FROM rm_approval WHERE enable =1 AND user_id='"+ic_code+"';";
        // this.debug.Log(SQL);
        let data;
        try{
            data =await dbConnection.query(SQL);
            // console.log(data[0]);
            return data[0];
        }catch(err) {
            console.log(err);
        }        
    }
}

// const emp = new Employee();
// let user = emp.getEmployeeByID('0004').then(function(result){
//     console.log("result");
// });
// console.log(user);