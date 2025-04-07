import { mailLogin,dbConnJob,dbConnection,HOSTIP } from '../config/dbConfig'
import {  Debug } from './Debug';
import {  Employee } from './Employee';
import * as nodemailer from "nodemailer";

export class Job{
    private debug = new Debug(true,"Class Jobs.ts");
    private messageMail = 
      [
        {id:1,subject:"RM new Mission",msssage:"นี้คือ E-mail อัตโนมัติตอนนี้มี mission ที่ถูกสร้างโดย RM มาให้ท่านพิจารณา  \n\n ถ้าต้องการดูรายละเอียดให้กด Link ด้านล่างนี้ \n"}
      ];

    public async createJob(
        ic_code:string
        , customerType:string
        , customerName:string
        , customerId:string
        , target:number
        , message:string
        , email:string
        , target_time:string
        , target_time2:string
        , approval_id:string
        )
    {
        this.debug.Log("method: CreateJob");
        let date = this.debug.showTime();
        let status = "CREATE";
        message = this.debug.antiQuote(message);
        let S1 = "SELECT employee_id ,name_eng ,email  FROM employees WHERE employee_id ='"+approval_id+"'";

        let SQL =`INSERT INTO rm_jobs(customer_name,customer_id,customer_type,ic,text,target,created,status,target_time,target_time2,approver,enable
        ) VALUES(
            '${customerName}','${customerId}','${customerType}','${ic_code}','${message}','${target}','${date}','${status}','${target_time}','${target_time2}','${approval_id}','1')`;
        let result:any;
        try{
            let approver = await dbConnection.query(S1);
            approver = approver[0];
            // console.log(approver[0]);
            console.log("--------------------------------------------------------------------------");
            // console.log(SQL);
            result = await dbConnJob.query(SQL);

    //Process 1 --> Send Email to Approver -----------------------------------------------------------> 1  
            if(approver.length > 0){
              let msg = this.messageMail[0];
              let param = ic_code+"|"+date;
              let encode = btoa(param);
              let Email = approver[0].email;
  
              let textMsg = msg.msssage+"\nApproved link:http://"+HOSTIP+"/job/approve/"+encode;

              // let subject = "RM รหัส("+ic_code+") ได้สร้างกิจกรรมใหม่เพื่ออนุมัติ"; 
              let subject = "RM รหัส("+ic_code+") action plan เพื่ออนุมัติ"; 
      
              let mail =await this.sendMail(subject,textMsg,Email);
              this.debug.Log(Email+" Send mail:");
            }else{
              this.debug.Log("Can not found sender Email !!");
            }
            return result;
        }catch(err){
            console.log(err);
            this.debug.Log("error !!");
            return "0";
        }
    }

    public async editJob(
      job_id:string
      ,ic_code:string
      , customerType:string
      , customerName:string
      , customerId:string
      , target:number
      , message:string
      , target_time:string
      , target_time2:string
      , approval_id:string
      , create_time:string
      ){
        this.debug.Log("method: EditJob");
        let date = this.debug.convertDate(create_time);
        let status = "CREATE";
        message = this.debug.antiQuote(message);
        let S1 = "SELECT employee_id ,name_eng ,email  FROM employees WHERE employee_id ='"+approval_id+"'";


        let SQL = `UPDATE rm_jobs SET 
          customer_name ='${customerName}' 
          ,customer_id  ='${customerId}'
          ,customer_type  ='${customerType}'
          ,text  ='${message}'
          ,target  ='${target}'
          ,status  ='${status}'
          ,target_time  ='${target_time}'
          ,target_time2  ='${target_time2}'
          WHERE job_id='${job_id}'`;
        let result:any;
        try{
            let approver = await dbConnection.query(S1);
            approver = approver[0];
            // console.log(approver[0]);
            console.log("--------------------------------------------------------------------------");
            // console.log(SQL);
            result = await dbConnJob.query(SQL);

    //Process 1 --> Send Email to Approver -----------------------------------------------------------> 1  
            if(approver.length > 0){
              let msg = this.messageMail[0];
              let param = ic_code+"|"+date;

              this.debug.Log(param);
              let encode = btoa(param);
              let Email = approver[0].email;
  
              let textMsg = msg.msssage+"\nApproved link:http://"+HOSTIP+"/job/approve/"+encode;

              let subject = "RM รหัส("+ic_code+") ได้แก้ไขกิจกรรมใหม่เพื่ออนุมัติ"; 
      
              let mail =await this.sendMail(subject,textMsg,Email);
              this.debug.Log(Email+" Send mail:");
            }else{
              this.debug.Log("Can not found sender Email !!");
            }
            return result;
        }catch(err){
            console.log(err);
            this.debug.Log("error !!");
            return "0";
        }
    }

    public async loadJobs(ic_code:string,permission:string,month:string,year:string){
      this.debug.Log(ic_code+" permission: "+permission);
      let codition_1 = "";  
      if(permission ==='1'){
        codition_1 = "AND ic='"+ic_code+"' ";
      }else if(permission ==='2'){
        codition_1 = "AND (ic='"+ic_code+"' OR approver='"+ic_code+"') ";
      }else if (permission ===undefined){
        codition_1 = "AND ic='"+ic_code+"' ";
      }

      let SQL = `SELECT job_id,customer_name ,customer_id ,customer_type ,ic, text ,target 
                ,created, status ,approver, target_time, target_time2 
                FROM rm_jobs WHERE enable > 0 AND status <> "END"  
                AND (target_time BETWEEN '${year}-${month}-01' AND LAST_DAY('${year}-${month}-01')) 
                ${codition_1}  ORDER BY created DESC`;
      this.debug.Log("Method loadJobs :"+ic_code);
    
      // console.log(SQL);
      try{
        
        let result = await dbConnJob.query(SQL);
        return result[0];
      }catch(err){
        console.log(err);
        return 0;
      }
    }

    public async sendMail(mailSubject:string,message:string,mailTo:string){
      this.debug.Log("function sendMail");
        var transporter = nodemailer.createTransport({
            service: mailLogin.service,
            auth: {
              user: mailLogin.auth.user,
              pass: mailLogin.auth.pass
            }
        });
        var mailOptions = {
            from: 'wealthconcept@gmail.com',
            to: mailTo,
            subject: mailSubject,
            text: message
        };
        console.log(mailOptions);
        return await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              // console.log(error);
              return error;
            } else {
              // console.log('Email sent: ' + info.response);
              return 'Email sent: ' + info.response;
            }
        });
    }

    public async select(ic_code:string,date:string){
      let SQL= `SELECT job_id,customer_name ,customer_id ,customer_type ,ic,text ,target 
      ,created, status ,approver,DATE_FORMAT(target_time , '%d/%m/%Y') target_time, DATE_FORMAT(target_time2 , '%d/%m/%Y') target_time2 
      FROM rm_jobs WHERE ic='${ic_code}' AND created='${date}'`;
      this.debug.Log("method select :"+ic_code);
      console.log(SQL);

      try{        
        let result = await dbConnJob.query(SQL);
        let approval_id = result[0][0].approver;
        let emp = new Employee();
        let approver =await emp.getEmployee(approval_id);
        if(approver.length>0){
          result[0][0].approver = approver[0].name_th + " "+ approver[0].lastname_th;
          result[0][0].approval_id = approval_id;
        }

        let jobOwnner =await emp.getEmployee(ic_code);
        if(jobOwnner.length > 0){
          result[0][0].ownner  = jobOwnner[0].name_th + " "+ jobOwnner[0].lastname_th;
        }
        // console.log(result[0]);
        return result[0];
      }catch(err){
        console.log(err);
        return 0;
      }
    }

    public async selectByID(ic_code:string,job_id:string){
      let SQL= `SELECT job_id,customer_name ,customer_id ,customer_type ,ic,text ,target 
      ,created, status ,approver,DATE_FORMAT(target_time , '%d/%m/%Y') target_time, DATE_FORMAT(target_time2 , '%d/%m/%Y') target_time2 
      FROM rm_jobs WHERE ic='${ic_code}' AND job_id='${job_id}'`;

      // console.log(SQL);
      this.debug.Log("method selectByID :"+ic_code);

      try{        
        let result = await dbConnJob.query(SQL);
        // console.log(result[0][0]);
        let approval_id = result[0][0].approver;
        let emp = new Employee();
        let approver =await emp.getEmployee(approval_id);
        if(approver.length > 0){
          result[0][0].approver = approver[0].name_th + " "+ approver[0].lastname_th;
          result[0][0].approval_id = approval_id;
        }

        let jobOwnner =await emp.getEmployee(ic_code);
        if(jobOwnner.length > 0){
          result[0][0].ownner  = jobOwnner[0].name_th + " "+ jobOwnner[0].lastname_th;
        }
        // console.log(result[0]);
        return result[0];
      }catch(err){
        console.log(err);
        return 0;
      }
    }

    public async findByID(job_id:string){
      let SQL= `SELECT job_id,customer_name ,customer_id ,customer_type ,ic,text ,target 
      ,created, status ,approver,DATE_FORMAT(target_time , '%d/%m/%Y') target_time, DATE_FORMAT(target_time2 , '%d/%m/%Y') target_time2 
      FROM rm_jobs WHERE job_id='${job_id}'`;

      // console.log(SQL);
      this.debug.Log("method selectByID :"+job_id);

      try{        
        let result = await dbConnJob.query(SQL);
        // console.log(result[0][0]);
        let approval_id = result[0][0].approver;
        let emp = new Employee();
        let approver =await emp.getEmployee(approval_id);
        if(approver.length>0){
          result[0][0].approver = approver[0].name_th + " "+ approver[0].lastname_th;
          result[0][0].approval_id = approval_id;
        }
        // console.log(result[0]);
        return result[0];
      }catch(err){
        console.log(err);
        return 0;
      }
    }

    public async approvedJob(job_id:string,approval_id:string){
      this.debug.Log("function approvedJob");
      let SQL = "UPDATE rm_jobs SET status = 'APPROVED' WHERE job_id ='"+job_id+"'";
      this.debug.Log(SQL);
      try{
        let result = await dbConnJob.query(SQL);

        let job = await this.findByID(job_id);
        
        let emp =await new Employee().getEmployeeByID(job[0].ic);
        // console.log(emp);
        if(emp.length>0){
          let subject = "RM Job หมายเลข"+job_id+ "ได้ถูกอนุมัติแล้ว";
          let msg = "RM Job "+job_id + "ถูก Approved เรียบร้อยแล้ว\n  ";
  
          let param = job[0].ic+"|"+job_id;
          let encoded = btoa(param);
  
          let textMsg = msg+"\nRead link:http://"+HOSTIP+"/job/read/"+encoded;
  
          let aws = await this.sendMail(subject,textMsg,emp[0].email);
          // this.debug.Log(""+aws);
          return "1";
        }else{
          this.debug.Log("ไม่พบ Employee :"+job[0].ic);
          return "0";
        }
        
      }catch(err){
        console.log(err);
        return "0";
      }
    }

    public async rejectJob(job_id:string,approval_id:string){
      this.debug.Log("function rejectJob");
      let SQL = "UPDATE rm_jobs SET status = 'REJECTED' WHERE job_id ='"+job_id+"' AND ic='"+approval_id+"'";

      try{
        let result = await dbConnJob.query(SQL);

        let job = await this.findByID(job_id);
        
        let emp =await new Employee().getEmployeeByID(job[0].ic);
        // console.log(emp);
        if(emp.length>0){
          let subject = "RM Job หมายเลข"+job_id+ "ได้ถูกปฏิเสธการอนุมัติแล้ว";
          let msg = "RM Job "+job_id + "ได้ถูกปฏิเสธการอนุมัติแล้ว\n  ";
  
          let param = job[0].ic+"|"+job_id;
          let encoded = btoa(param);
  
          let textMsg = msg+"\nRead link:http://"+HOSTIP+"/job/read/"+encoded;
  
          let aws = await this.sendMail(subject,textMsg,emp[0].email);
          // this.debug.Log(""+aws);
          return "1";
        }else{
          this.debug.Log("ไม่พบ Employee :"+job[0].ic);
          return "0";
        }
        
      }catch(err){
        console.log(err);
        return "0";
      }
    }    
    public async successJob(job_id:string,approval_id:string){
      this.debug.Log("function successJob");
      let SQL = "UPDATE rm_jobs SET status = 'SUCCESS' WHERE job_id ='"+job_id+"' ";
      try{
        let result = await dbConnJob.query(SQL);

        let job = await this.findByID(job_id);
        
        let emp =await new Employee().getEmployeeByID(approval_id);
        let rm = await new Employee().getEmployeeByID(job[0].ic);
        let rm_name = rm[0].name_th+' '+rm[0].lastname_th;
        // console.log(emp);
        let subject = "RM Job"+job_id;
        let msg = "RM Job_"+job_id + "ถูก Success เรียบร้อยแล้ว \n";

        let detail = `RM : ${rm_name}\nลูกค้า : ${job[0].customer_name} \nDetail : ${job[0].text}\n target : ${job[0].target} `;
        msg = msg + detail;

        let aws = await this.sendMail(subject,msg,emp[0].email);
        // this.debug.Log(""+aws);
        return "1";
      }catch(err){
        console.log(err);
        return "0";
      }
    }

    public async reportJobs(month:string){
      let SQL = `SELECT job_id,customer_name ,customer_id ,customer_type ,ic, text ,target 
                ,created, status ,approver, target_time, target_time2 
                FROM rm_jobs WHERE enable > 0 AND status <> "END"  
                AND (target_time BETWEEN '${month}-01' AND LAST_DAY('${month}-01')) 
                ORDER BY created DESC`;
      this.debug.Log("Method loadJobs :");
      console.log(SQL);
      try{        
        let result = await dbConnJob.query(SQL);
        // console.log(result[0]);
        return result[0];
      }catch(err){
        console.log(err);
        return 0;
      }
    }
    
}
// const job = new Job().createJob('0004','n','test','3100601766923',3000,'ทดสอบ','rangsan.wc@gmail.com','2023-04-29','2023-04-29','0004');