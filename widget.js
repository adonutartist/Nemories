const {ipcRenderer} = require("electron");
document.getElementById("closeBtn").onclick = () => {
    ipcRenderer.send("close-widget"); 
}
const canvas = document.getElementById("widgetCanvas");
const ctx = canvas.getContext("2d");
const emotionColors = {
    happy:"#47ff6b",
    excited:"#ffe84d",
    loving:"#ff63d5",
    neutral:"#ffffff",
    sad:"#66c8ff",
    angry:"#ff5050",
    tired:"#a78bfa"
};
function drawWidgetChart(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const memories = JSON.parse(localStorage.getItem("memories")) || [];
    const counts = {};
    memories.forEach(memory => {
        counts[memory.emotion] = (counts[memory.emotion] || 0)+1;
    });
    const total = memories.length;
    const center = canvas.width/2;
    const radius = 85;
    if(total === 0){
        ctx.fillStyle = "white";
        ctx.font = "14px Consolas";
        ctx.textAlign = "center";
        ctx.fillText("No Nemories Yet :<",canvas.width/2,canvas.height/2);
        return;
    }
    let startAngle = -Math.PI/2;
    Object.keys(counts).forEach(emotion=>{
        const amount=counts[emotion];
        const slice=amount/total*Math.PI*2;
        const mid = startAngle+slice/2;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center,center,radius,startAngle,startAngle+slice);
        ctx.closePath();
        ctx.fillStyle=emotionColors[emotion];
        ctx.shadowColor = emotionColors[emotion];
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        const percent = Math.round(amount/total*100);
        if(percent >= 6){
            const color = emotionColors[emotion];
            const rgb = color.match(/\w\w/g).map(v=>parseInt(v,16));
            const brightness = (rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000;
            ctx.fillStyle = brightness >170 ? "#111" : "#fff";
            ctx.font = "bold 15px Consolas";
            ctx.textAlign="center";
            ctx.textBaseline = "middle";
            const textRadius = radius*0.62;
            ctx.fillText(percent+"%",center+Math.cos(mid)*textRadius,center+Math.sin(mid)*textRadius);
        }
        startAngle+=slice;
    });
    ctx.beginPath();
    ctx.arc(center,center,32,0,Math.PI*2);
    ctx.fillStyle="#151515";
    ctx.fill();
    ctx.fillStyle="white";
    ctx.font="bold 18px Consolas";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(total,center,center-5);
    ctx.font = "11px Consolas";
    ctx.fillStyle="#999";
    ctx.fillText(total===1 ? "Nemory" : "Nemories", center, center+10);
}
drawWidgetChart();
window.addEventListener("storage",()=>{
    drawWidgetChart();
})