class Validation{


    public validation(){
        const inputDateStart = document.getElementById('date-start') as HTMLInputElement;
        const inputMonthStart = document.getElementById('month-select') as HTMLInputElement;
        const inputYearStart = document.getElementById('txt-year') as HTMLInputElement;
    
        const inputDateEnd = document.getElementById('date-end') as HTMLInputElement;
        const inputMonthEnd = document.getElementById('month-select-end') as HTMLInputElement;
        const inputYearEnd = document.getElementById('txt-year-end') as HTMLInputElement;

        let inputDateStartv:string = inputDateStart.value;
        let inputMonthStartv:string = inputMonthStart.value;
        let inputYearStartv:string = inputYearStart.value;

        let inputDateEndv = inputDateEnd.value;
        let inputMonthEndv = inputMonthEnd.value;
        let inputYearEndv = inputYearEnd.value;

        const now = new Date();
        const month = now.getMonth();

        if(inputDateStartv ==""){
            inputDateStart.value = "1";
        }
        if(inputDateEndv ==""){
            const year = parseInt(inputYearStartv);
            const month = parseInt(inputMonthStartv)
            inputDateEnd.value = inputDateEndv = this.getLastDateOfMonth( year,month).toString();
        }

        let startDate = inputYearStartv+'-'+inputMonthStartv+'-'+inputDateStartv;
        let endDate = inputYearEndv+'-'+inputMonthEndv+'-'+inputDateEndv;
        return [startDate,endDate];
    }

    public getLastDateOfMonth(year, month) {
        // month จะนับจาก 0-11 (0 = มกราคม, 11 = ธันวาคม)
        const lastDay = new Date(year, month , 0);
        return lastDay.getDate();
    }
}