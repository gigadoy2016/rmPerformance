const txtLog = function(rootFile,message){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // ตัดส่วนที่ไม่ต้องการเพื่อให้ได้รูปแบบ YYYY-MM-DD
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false }); // ให้แสดงเป็น 24 ชั่วโมง

    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    console.log("======================================================");
    console.log(`[DEBUG (${rootFile})- ${formattedDateTime}] ${message}`);
}

const debugLog = function(message){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // ตัดส่วนที่ไม่ต้องการเพื่อให้ได้รูปแบบ YYYY-MM-DD
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false }); // ให้แสดงเป็น 24 ชั่วโมง

    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    console.log("======================================================");
    console.log(`[DEBUG ${formattedDateTime}] ${message}`);
}
module.exports = { txtLog,debugLog }