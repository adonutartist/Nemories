const canvas = document.getElementById("worldCanvas");
const ctx = canvas.getContext("2d");
const noteButton = document.getElementById("noteButton");
const journalModal = document.getElementById("journalModal");
const saveMemory = document.getElementById("saveMemory");
const emotionButtons = document.querySelectorAll(".emotion");
let selectedEmotion = "happy";
function resizeCanvas(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
const camera = {x: 0, y: 0, zoom: 1};
const roads = [];
const buildings = [];
const intersections = [];
const player = {x: 0, y: 0, radius: 6};
class Intersection{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class Road{
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
class Building{
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}
function drawRoads(){
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#555";
    roads.forEach(road => {
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 + road.x1, canvas.height/2 + road.y1);
        ctx.lineTo(canvas.width/2 + road.x2, canvas.height/2 + road.y2);
        ctx.stroke();
    });
}
function drawBuildings(){
    buildings.forEach(building => {
        ctx.fillStyle = building.color;
        ctx.fillRect(canvas.width/2 + building.x, canvas.height/2 + building.y, building.width, building.height);
    });
}
function drawPlayer(){
    const screenX = canvas.width/2;
    const screenY = canvas.height/2;
    ctx.beginPath();
    ctx.arc(screenX, screenY, player.radius, 0, Math.PI*2);
    ctx.fillStyle = "#00ff66";
    ctx.shadowColor = "#00ff44";
    ctx.fill();
    ctx.shadowBlur = 0;
}
function render(){
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawRoads();
    drawBuildings();
    drawPlayer();
    requestAnimationFrame(render);
}
noteButton.addEventListener("click", () => {
    journalModal.classList.remove("hidden");
});
saveMemory.addEventListener("click", () => {
    journalModal.classList.add("hidden");
});
emotionButtons.forEach(button => {
    button.addEventListener("click", () => {
        emotionButtons.forEach(btn => {
            btn.classList.remove("selected");
        });
        button.classList.add("selected");
        selectedEmotion = button.dataset.emotion;
    });
});
emotionButtons[0].classList.add("selected");
intersections.push(new Intersection(0, 0));
roads.push(new Road(0, 0, 0, -120));
buildings.push(new Building(-25, -180, 50, 50, "#FFD54F"));
render();