// import moment from 'moment';
// import * as moment from "moment";
export class Debug{
    public on:boolean;
    private name:string = "";

    constructor(status:boolean,name:string){
        if(status !== undefined)
            this.on = status;
        else
            this.on = false;
        this.name = name;
    }
    
    public debugLog(message:string) {
        this.Log(message);
    }
    public showTime():string{
        const times = new Date();
        const year:number = times.getFullYear();
        const month:string = String("0" + (times.getMonth()+1)).slice(-2);
        const date:string = String("0" + times.getDate()).slice(-2);

        const HH:string = String("0" + times.getHours()).slice(-2);
        const mm:string = String("0" + times.getMinutes()).slice(-2);
        const ss:string = String("0" + times.getSeconds()).slice(-2);
        const time = year+"-"+month+"-"+date+" "+HH+":"+mm+":"+ss;
        return time;
    }
    public convertDate(txt:string):string{
        const times = new Date(txt);
        const year:number = times.getFullYear();
        const month:string = String("0" + (times.getMonth()+1)).slice(-2);
        const date:string = String("0" + times.getDate()).slice(-2);

        const HH:string = String("0" + times.getHours()).slice(-2);
        const mm:string = String("0" + times.getMinutes()).slice(-2);
        const ss:string = String("0" + times.getSeconds()).slice(-2);
        const time = year+"-"+month+"-"+date+" "+HH+":"+mm+":"+ss;
        return time;
    }


    public Log(msg:string):void{
        const time = this.showTime();
        // console.log(time);
        if(this.on){
            console.log(`[DEBUG (${this.name})- ${time}] ${msg}`);
        }
    }

    public antiQuote(txt:string):string{
        var text = "";
        text  = txt.replace(/'/g,'&#39');
        text  = text.replace(/"/g,'&#39');
        text  = text.replace(/\\/g,'-');
        return text;
    }

}

// var test = new Debug(true,"test");
// console.log(test.antiQuote("teste'test\\0'test'es"));
// console.log("testte'stte'tst".replace(/'/g,"&#39"));
// console.log(test.convertDate("2023-11-14T07:37:29.000Z"));
