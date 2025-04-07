class JobTable{
    private tableId:string = "";
    private tableObj:HTMLTableElement ;
    private DATAs:any;
    private MONTH:string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    private permission:number = 1;

    constructor(id:string,data:any){
        this.tableId = id;
        this.tableObj = <HTMLTableElement>document.getElementById(id);
        this.DATAs = data;
    }

    public removeRowAll():void{
        console.log(">>>>>>>>> Table: remove rows All");
        let tbody = this.tableObj.getElementsByTagName('tbody')[0];
        let rows = tbody.getElementsByTagName('tr');
        while(rows.length > 0){
            tbody.deleteRow(0);
        }
    }

    public setPermission(permission:number){
        if(permission === undefined){
            this.permission = 0;
        }else{
            this.permission = permission;
        }
        
    }

    public getContent():void{
        this.removeRowAll();
        console.log(">>>>>>>>> Table: getContent");
        let tbody = this.tableObj.getElementsByTagName('tbody')[0];
        
        // newRow.innerHTML = "<td colspan='4'>No Data.</td><td>"+rows.length+"</td>";
        if(this.DATAs.length ==0){
            let newRow = tbody.insertRow();
            newRow.innerHTML = "<td colspan='5'>No Data.</td><td></td>";
        }else{
            for(let i=0; i < this.DATAs.length;i++){
                let data = this.DATAs[i];
                let newRow = tbody.insertRow();
                let cell0 = newRow.insertCell(0);
                let cell1 = newRow.insertCell(1);
                let cell2 = newRow.insertCell(2);
                let cell3 = newRow.insertCell(3);
                let cell4 = newRow.insertCell(4);

                let param = data.ic+"|"+data.job_id;
                let encoded = btoa(param);

                let uri = "/job/read/"+encoded;
                
                cell0.innerHTML = i+1+".";
                // cell1.innerHTML = "<a>"+data.customer_name+"</a><br /><small>CID:"+data.customer_id+"</small>";
                // console.log(">>>>>>>>> Table: getContent "+ this.permission);
                // console.log(data);
                if( this.permission <= 1 ){
                    cell1.innerHTML = "<a>"+data.customer_name+"</a>";
                }else{
                    cell1.innerHTML = "<a>"+data.customer_name+" (ic:"+ data.ic +")</a>";
                }
                
                cell2.innerHTML = "<a href='"+uri+"' target='_blank'>"+data.text+" </a>";
                cell3.innerHTML = "<b>"+data.target.toLocaleString('en-US')+" ฿.</b><br /><small>"+this.formatDate(data.target_time)+" - "+this.formatDate(data.target_time2)+"</small>";
                cell3.style.textAlign = "right";
                cell4.innerHTML = '<button type="button" class="btn '+this.getStatus(data.status)+' btn-xs">'+data.status+'</button><br /><small>Created '+this.formatDate(data.created)+'</small>';
                cell4.style.textAlign = "right";

            }
        }
    }
    public formatDate(txt:string):string{
        const times = new Date(txt);
        const year:number = times.getFullYear();
        // const month:string = String("0" + (times.getMonth()+1)).slice(-2);
        const month = this.MONTH[times.getMonth()];
        const date:string = String("0" + times.getDate()).slice(-2);

        const HH:string = String("0" + times.getHours()).slice(-2);
        const mm:string = String("0" + times.getMinutes()).slice(-2);
        const ss:string = String("0" + times.getSeconds()).slice(-2);
        // let format = year+"-"+month+"-"+date+" "+HH+":"+mm+":"+ss;
        let format = date+"-"+month+"-"+year;
    
        return format;
    }
    private getStatus(status){
        let result = "";
        if(status === "CREATE" ){
            result = "btn-secondary";
        }else if(status === "SUCCESS"){
            result = "btn-success";
        }else if(status === "APPROVED"){
            result = "btn-primary";
        }else if(status === "REJECTED"){
            result = "btn-danger";
        }
        return result;
    }
}