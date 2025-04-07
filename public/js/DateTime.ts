class DateTime{
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
    public convertDate2(txt:string):string{
        const times = new Date(txt);
        const year:number = times.getFullYear();
        const month:string = String("0" + (times.getMonth()+1)).slice(-2);
        const date:string = String("0" + times.getDate()).slice(-2);

        const HH:string = String("0" + times.getHours()).slice(-2);
        const mm:string = String("0" + times.getMinutes()).slice(-2);
        const ss:string = String("0" + times.getSeconds()).slice(-2);
        const time = year+"-"+month+"-"+date;
        return time;
    }
}