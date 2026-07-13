
const { BrowserWindow } = require("electron");
const {ipcRenderer} = require("electron");
const hoverSfx = new Audio("hoversfx.wav");
const pigeonImage = new Image();
const pigeonScaled = document.createElement("canvas");

pigeonImage.onload = () => {
    const scale = 4;
    pigeonScaled.width = pigeonImage.width * scale;
    pigeonScaled.height = pigeonImage.height * scale;
    const pctx = pigeonScaled.getContext("2d");
    pctx.imageSmoothingEnabled = false;
    pctx.drawImage(
        pigeonImage,
        0,
        0,
        pigeonScaled.width,
        pigeonScaled.height
    );
};
pigeonImage.src = "Pidgeon Sprite Sheet.png";
const canvas = document.getElementById("worldCanvas");
const ctx = canvas.getContext("2d");
const BIRD_MIN_DISTANCE = 45;
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
const noteButton = document.getElementById("noteButton");
const journalModal = document.getElementById("journalModal");
const saveMemory = document.getElementById("saveMemory");
const cancelMemory = document.getElementById("cancelMemory");
const addMemory = document.getElementById("addMemory");
const memoryListView = document.getElementById("memoryListView");
const memoryEditorView = document.getElementById("memoryEditorView");
const memoryList = document.getElementById("memoryList");
const memoryText = document.getElementById("memoryText");
const emotionButtons = document.querySelectorAll(".emotion");
const closeEditor = document.getElementById("closeEditor");
const statsButton = document.getElementById("statsButton");
const statsModal = document.getElementById("statsModal");
const closeStats = document.getElementById("closeStats");
const desktopWidget = document.getElementById("desktopWidget");
const pieChart = document.getElementById("pieChart");
const pieCtx = pieChart.getContext("2d");
const statsLegend = document.getElementById("statsLegend");
const aboutButton = document.getElementById("aboutButton");
const aboutModal = document.getElementById("aboutModal");
const closeAbout = document.getElementById("closeAbout");
const {shell} = require("electron");
const githubButton = document.getElementById("githubButton");
const moodButton = document.getElementById("moodButton");
const moodModal = document.getElementById("moodModal");
const closeMood = document.getElementById("closeMood");
const moodChart = document.getElementById("moodChart");
const moodCtx = moodChart.getContext("2d");
const ROAD_WIDTH = 2;
let cameraFollowing = false;
let hoveredMoodPoint = null;
let moodHistoryCache = [];
let memories = JSON.parse(localStorage.getItem("memories")) || [];
let lastHoveredElement = null;
let selectedEmotion = "happy";
let editIndex = null;
let hoverBuilding = null;
let hoveredSlice = -1;
let widgetWindow = null;
const emotionColors = {
    happy:"#47ff6b",
    excited:"#ffe84d",
    loving:"#ff63d5",
    neutral:"#ffffff",
    sad:"#66c8ff",
    angry:"#ff5050",
    tired:"#a78bfa"
};
const emotionScores = {
    loving: 3,
    happy: 2,
    excited: 2,
    neutral: 0,
    tired: -1,
    sad: -2,
    angry: -3
};
desktopWidget.onclick=()=>{
    console.log("open widget button clicked");
    ipcRenderer.send("open-widget");
};
function getMoodHistory(){
    const days = {};
    memories.forEach(memory=>{
        const day = memory.date.slice(0,10);
        if(!days[day]){
            days[day]={total:0,count:0};
        }
        days[day].total+=emotionScores[memory.emotion];
        days[day].count++;
    });
    return Object.keys(days).sort().map(day=>{return{day, mood: days[day].total/days[day].count, count:days[day].count};});
}
function playHoverSound(){
    hoverSfx.currentTime = 0;
    hoverSfx.play().catch(()=>{});
}
function showList(){
    memoryListView.classList.remove("hidden");
    memoryEditorView.classList.add("hidden");
    renderMemories();
}
function openEditor(index = null){
    memoryListView.classList.add("hidden");
    memoryEditorView.classList.remove("hidden");
    editIndex = index;
    if(index !== null){
        memoryText.value = memories[index].text;
        selectedEmotion = memories[index].emotion;
    }
    else{
        memoryText.value = "";
    }
}
function renderMemories(){
    memoryList.innerHTML = "";
    if(memories.length === 0){
        memoryList.innerHTML = "<p>No Nemories Yet :<</p>";
        return;
    }
    memories.forEach((memory, index) => {
        let card = document.createElement("div");
        card.className = "memoryCard";
        card.style.borderLeftColor = emotionColors[memory.emotion];
        card.innerHTML = `
        <div class = "memoryEmotion" style = "color:${emotionColors[memory.emotion]}">
        ${getFace(memory.emotion)}
        </div>
        <div class = "memoryNumber">
        Memory #${index+1}
        </div>
        `;
        card.onclick = () => openEditor(index);
        memoryList.appendChild(card);
    });
    if(memories.length === 0){
        addMemory.style.marginTop = "150px";
    }
    else{
        addMemory.style.marginTop = "25px";
    }
}
function getFace(emotion){
    let faces = {
        happy: ":]",
        excited:"xD",
        loving:"<3",
        neutral:":|",
        sad:";-;",
        angry:">:c",
        tired:":p"
    };
    return faces[emotion];
}
emotionButtons.forEach(button => {
    button.onclick = () => {
        emotionButtons.forEach(b => b.classList.remove("selected"));
        button.classList.add("selected");
        selectedEmotion = button.dataset.emotion;
    };
});
saveMemory.onclick = () => {
    let data = {
        text: memoryText.value,
        emotion: selectedEmotion,
        date: new Date().toISOString()
    };
    if(editIndex !== null){
        data.date = memories[editIndex].date;
        memories[editIndex] = data;
    }
    else{
        memories.push(data);
    }
    saveWorld();
    window.dispatchEvent(new Event("storage"));
    if(editIndex === null){
        spawnBuilding(memories.length-1);
    }
    showList();
};
addMemory.onclick = () => {
    openEditor();
};
cancelMemory.onclick = () => {
    showList();
};
showList();
const closeJournal = document.getElementById("closeJournal");
function resizeCanvas(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
const camera = {x: 0, y: 0, zoom: 1};
let dragging = false;
let dragDistance = 0;
const DRAG_THRESHOLD = 5;
let lastMouseX = 0;
let lastMouseY = 0;
const roads = [];
const buildings = [];
const birds = [];
const flocks=[];
let mouse = {
    x:0,
    y:0
};
const intersections = [];
const roadNodes = [];
const player = {x: 0, y: 0, radius: 6, pulse: 0, speed: 2.5};
class Intersection{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class Road{
    constructor(x1, y1, x2, y2, bend=null, openEnd=true){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.bend = bend;
        this.openEnd = openEnd;
    }
}
class RoadNode{
    constructor(x, y, parent = null){
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.children = [];
        this.hasBuilding = false;
        this.hasBuildingBranch = false;
        this.reserved = false;
    }
}
class Building{
    constructor(x, y, width, height, color, memoryID){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.memoryID = memoryID;
    }
    update(){
        const memory = memories[this.memoryID];
        if(memory){
            this.color = emotionColors[memory.emotion];
        }
    }
}
class Flock{
    constructor(x,y,count){
        this.x=x;
        this.y=y;
        this.state="landed";
        this.birds=[];
        this.scared=false;
        for(let i=0;i<count;i++){
            let birdX;
            let birdY;
            let attempts=0;
            do{
                const angle=Math.random()*Math.PI*2; 
                const dist = 40+Math.random()*60;
                birdX=x+Math.cos(angle)*dist;
                birdY=y+Math.sin(angle)*dist;
                attempts++;
            } while(
                (!validBirdPosition(birdX,birdY)||this.isTooClose(birdX,birdY))&& attempts<100
            );
            const bird=new Bird(birdX,birdY);
            bird.homeX=bird.x;
            bird.homeY=bird.y;
            this.birds.push(bird);
        }
    }
    isTooCloseExcept(x,y,ignoreBird){
        const minDistance=35;
        for(const bird of this.birds){
            if(bird===ignoreBird) continue;
            const dx = bird.x-x;
            const dy = bird.y-y;
            const distance=Math.sqrt(dx*dx+dy*dy);
            if(distance<minDistance){
                return true;
            }
        }
        return false;
    }
    isTooClose(x,y){
        const minDistance=35;
        for(const bird of this.birds){
            const dx=bird.x-x;
            const dy=bird.y-y;
            const distance=Math.sqrt(dx*dx+dy*dy);
            if(distance<minDistance){
                return true;
            }
        }
        return false;
    }
    update(){
        this.birds.forEach(b=>b.update());
        if(this.state==="returning" &&
            this.birds.every(b=>b.state==="idle")
        ){
            this.state="landed";
        }
        if(
    this.state==="flying" &&
    this.birds.every(b=>b.state==="gone")
){
    const b =
        buildings[
            Math.floor(Math.random()*buildings.length)
        ];
    if(b){
        this.x=b.x+b.width/2
        this.y=b.y+b.height+20;
        this.state="returning";
        this.birds.forEach((bird)=>{
            bird.x=this.x+(Math.random()-0.5)*300;
            bird.y=this.y-500-Math.random()*200;
            let angle = Math.random()*Math.PI*2;
            let dist = 40+Math.random()*60;
            bird.targetX=this.x+Math.cos(angle)*dist;
            bird.targetY=this.y+Math.sin(angle)*dist;
            bird.state="returning";
            bird.timer=0;
        });
    }
}
        let sx = 0;
        let sy = 0;
        this.birds.forEach(b => {
        sx += b.x + b.size/2;
        sy += b.y + b.size/2;
        });
        this.x = sx / this.birds.length;
        this.y = sy / this.birds.length;
    }
    scare(){
    if(this.state==="flying") return;
    this.state="flying";
    this.birds.forEach(b=>{
        b.state="fly";
        const angle =
            -Math.PI/2 +
            (Math.random()-0.5)*0.7;
        const speed = 5 + Math.random()*2;
        b.vx = Math.cos(angle)*speed;
        b.vy = Math.sin(angle)*speed;
        b.timer = 0;
    });
}
}
class Bird{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.vx=0;
        this.vy=0;
        this.frame=0;
        this.timer = 0;
        this.state="idle";
        this.scale=1;
        this.seed=Math.random()*1000;
        this.size=128;
        this.targetX=x;
        this.targetY=y;
    }
    update(){
        this.timer++;
        switch(this.state){
            case "idle":this.frame=Math.floor(this.timer/10)%4;
            if(this.timer>180+Math.random()*180){
                this.state="eat";
                this.timer=0;
            }
            break;
            case "eat":this.frame=8+Math.floor(this.timer/8)%4;
            if(this.timer>60){
                this.state="idle";
                this.timer=0;
            }
            break;
            case "fly":
            case "returning":
                this.frame=12+Math.floor(this.timer/4)%4;
            if(this.state==="fly"){
                this.x+=this.vx;
                this.y+=this.vy;
                if(
                    this.x < -800 ||
                    this.x > 5000 ||
                    this.y < -800 ||
                    this.y > 5000
                ){
                    this.state = "gone";
                }
            }
            if(this.state==="returning"){
                const dx=this.targetX-this.x;
                const dy=this.targetY-this.y;
                const distance=Math.sqrt(dx*dx+dy*dy);
                const speed=4;
                if(distance<3){
                    this.x=this.targetX;
                    this.y=this.targetY;
                    this.state="idle";
                    this.timer=0;
                    this.frame=0;
                    return;
                }
                this.x+=(dx/distance)*speed;
                this.y+=(dy/distance)*speed;
            }
        break;
        }
    }
    respawn(){
        this.state="idle";
        this.timer=0;
        this.x=Math.random()*1200-600;
        this.y=Math.random()*1200-600;
    }
}
function tooCloseToOtherBird(x,y){
    for(const bird of birds){
        const dx=bird.x-x;
        const dy=bird.y-y;
        const distance=Math.sqrt(dx*dx+dy*dy);
        if(distance<BIRD_MIN_DISTANCE){
            return true;
        }
    }
    return false;
}
function isPointInsideBuilding(x,y,padding=20){
    for(const building of buildings){
        if(x>building.x-padding &&
            x<building.x+building.width+padding &&
            y>building.y-padding &&
            y<building.y+building.height+padding
        ){
            return true;
        }
    }
    return false;
}
function isNearRoad(x,y,distance=35){
    for(const road of roads){
        const dx=road.x2-road.x1;
        const dy=road.y2-road.y1;
        const length=Math.sqrt(dx*dx+dy*dy);
        const t=(((x-road.x1)*dx)+((y-road.y1)*dy))/(length*length);
        const clamped=Math.max(0,Math.min(1,t));
        const closestX=road.x1+clamped*dx;
        const closestY=road.y1+clamped*dy;
        const dist=Math.sqrt((x-closestX)**2+(y-closestY)**2);
        if(dist<distance){
            return true;
        }
    }
    return false;
}
function validBirdPosition(x,y){
    if(isPointInsideBuilding(x,y)){
        return false;
    }
    if(isNearRoad(x,y)){
        return false;
    }
    return true;
}
function drawBirds(){
    flocks.forEach(flock=>{
        flock.birds.forEach(bird=>{
            ctx.drawImage(
                pigeonScaled,
                (bird.frame%4)*128,
                Math.floor(bird.frame/4)*128,
                128,
                128,
                Math.round(bird.x),
                Math.round(bird.y),
                128,
                128
            );
        });
    });
}
const keys = {};
window.addEventListener("keydown",e=>{
    keys[e.key.toLowerCase()]=true;
});
window.addEventListener("keyup",e=>{
    keys[e.key.toLowerCase()]=false;
});
function updatePlayer(){
    let dx = 0;
    let dy = 0;
    if(keys["w"]){
        dy -= player.speed;
    }
    if(keys["s"]){
        dy += player.speed;
    }
    if(keys["a"]){
        dx -= player.speed;
    }
    if(keys["d"]){
        dx += player.speed;
    }
    if(dx===0 && dy===0){
        return false;
    }
    cameraFollowing=true;
    let moved = false
    const nextX = player.x+dx;
    const nextY = player.y+dy;
    if(isOnRoad(nextX,player.y)){
        player.x=nextX;
        moved = true;
    }
    if(isOnRoad(player.x,nextY)){
        player.y=nextY;
        moved=true;
    }
    return moved;
}
function isOnRoad(x,y){
    for(const road of roads){
        if(!road.bend){
            if(pointToLineDistance(x,y,road.x1,road.y1,road.x2,road.y2)<=ROAD_WIDTH/2){
                return true;
            }
        }
        else{
            if(pointToLineDistance(x,y,road.x1,road.y1,road.bend.x,road.bend.y)<=ROAD_WIDTH/2){
                return true;
            }
            if(pointToLineDistance(x,y,road.bend.x,road.bend.y,road.x2,road.y2)<=ROAD_WIDTH/2){
                return true;
            }
        }
    }
    return false;
}
function pointToLineDistance(px,py,x1,y1,x2,y2){
    const A = px-x1;
    const B = py-y1;
    const C = x2-x1;
    const D = y2-y1;
    const dot = A*C+B*D;
    const len = C*C+D*D;
    let param = dot/len;
    let xx;
    let yy;
    if(param<0){
        xx=x1;
        yy=y1;
    }
    else if(param>1){
        xx=x2;
        yy=y2;
    }
    else{
        xx=x1+param*C;
        yy=y1+param*D;
    }
    const dx=px-xx;
    const dy=py-yy;
    return Math.sqrt(dx*dx+dy*dy);
}
function drawRoads(){
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#555";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    roads.forEach(road => {
        ctx.beginPath();
        ctx.moveTo(road.x1, road.y1);
        if(road.bend){
            ctx.lineTo(
                road.bend.x,
                road.bend.y
            );
        }
        ctx.lineTo(road.x2, road.y2);
        if(!isRoadEndConnected(road)){
            let gradient = ctx.createLinearGradient(
                road.x1,
                road.y1,
                road.x2,
                road.y2
            );
            gradient.addColorStop(0, "#555");
            gradient.addColorStop(1, "#111");
            ctx.strokeStyle = gradient;
        }
        else{
            ctx.strokeStyle = "#555";
        }
        ctx.stroke();
    });
}
function isRoadEndConnected(road){
    for(const other of roads){
        if(other === road) continue;
        const distance = Math.hypot(
            road.x2 - other.x1,
            road.y2 - other.y1
        );
        if(distance<5){
            return true;
        }
    }
    return false;
}
function isRoadConnected(road){
    for(const b of buildings){
        if(road.x2>b.x && road.x2<b.x+b.width && road.y2>b.y && road.y2<b.y+b.height){
            return true;
        }
    }
    return false;
}
function drawBuildings(){
    buildings.forEach(building => {
        ctx.save();
        if(building === hoverBuilding){
            ctx.shadowColor = building.color;
            ctx.shadowBlur = 18;
        }
        ctx.fillStyle = "#222";
        ctx.fillRect(
    building.x,
    building.y,
    building.width,
    building.height
);
        ctx.strokeStyle = building.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(
    building.x,
    building.y,
    building.width,
    building.height
);
        ctx.restore();
    }); 
}
function createBuildingBranch(){
    const candidates = getExpandableNodes();
    console.log("expandable:", candidates.length);
    if(candidates.length === 0) return null;
    const parent = randomChoice(candidates);
    const directions = [0, Math.PI/2, Math.PI, -Math.PI/2];
    const used = new Set();
    for(const child of parent.children){
        const dx = Math.round((child.x - parent.x)/120);
        const dy = Math.round((child.y - parent.y)/120);
        used.add(`${dx},${dy}`);
    }
    const directionMap = [
        {angle: 0, key: "1,0"},
        {angle: Math.PI/2, key: "0,1"},
        {angle: Math.PI, key: "-1,0"},
        {angle: -Math.PI/2, key: "0,-1"}
    ];
    const possible = directionMap.filter(d=>!used.has(d.key)).map(d=>d.angle);
    console.log("possible directions:", possible.length);
    console.log("parent:", parent.x, parent.y, "children:", parent.children.length, "possible:", possible.length);
    if(possible.length === 0){
        return createBuildingBranch();
    }
    const angle = randomChoice(possible);
    const node1 = createRoadNode(parent, angle, 120);

const node2 = createRoadNode(node1, angle, 120);

return {
    parent,
    node: node2,
    angle
};
}
function drawBuildingLabels(){
    if(!hoverBuilding) return;
    const x = hoverBuilding.x + hoverBuilding.width/2;
    const y = hoverBuilding.y - 12;
    const text = `Memory #${hoverBuilding.memoryID + 1}`;
    ctx.save();
    ctx.font = "15px Consolas";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const padding = 8;
    const w = ctx.measureText(text).width + padding * 2;
    const h = 28;
    ctx.fillStyle = "rgba(20, 20, 20, 0.9)";
    ctx.strokeStyle = hoverBuilding.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x-w/2, y-h, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, x, y-h/2);
    ctx.restore();
}
function screenToWorld(x,y){
    return{
        x:
            (x-canvas.width/2)/camera.zoom
            -camera.x,
        y:
            (y-canvas.height/2)/camera.zoom
            -camera.y
    };

}
function createWorld(){
    const rootNode = new RoadNode(0,0);
    roadNodes.push(rootNode);
    player.x = rootNode.x;
    player.y = rootNode.y;
}
function distance(x1, y1, x2, y2){
    return Math.hypot(x2 - x1, y2 - y1);
}
function createRoadNode(parent, angle, length){
    const x = parent.x + Math.cos(angle) * length;
    const y = parent.y + Math.sin(angle) * length;
    const node = new RoadNode(x, y, parent);
    parent.children.push(node);
    roadNodes.push(node);
    roads.push(new Road(parent.x, parent.y, node.x, node.y));
    return node;
}
function getExpandableNodes(){
    return roadNodes.filter(node =>
    node.children.length < 6 &&
    !node.reserved
);
}
function randomChoice(array){
    return array[Math.floor(Math.random() * array.length)];
}
function growRoad(){
    const candidates = getExpandableNodes();
    if(candidates.length === 0) return null;
    const parent = randomChoice(candidates);
    const directions = [-Math.PI/2, 0, Math.PI/2, Math.PI];
    const used = parent.children.map(child => Math.atan2(child.y - parent.y, child.x - parent.x));
    const possible = directions.filter(dir => !used.some(a => Math.abs(a - dir)<0.1));
    if(possible.length === 0) return growRoad();
    const angle = randomChoice(possible);
    const junction = createRoadNode(parent, angle, 120);
    const endpoint = createRoadNode(junction, angle, 120);
    return {parent, junction, endpoint, angle};
}
function roadHitsBuilding(x1,y1,x2,y2){
    for(const b of buildings){
        if(
            Math.max(x1,x2)>b.x &&
            Math.min(x1,x2)<b.x+b.width &&
            Math.max(y1,y2)>b.y &&
            Math.min(y1,y2)<b.y+b.height
        ){
            return true;
        }
    }
    return false;
}
function buildingHitsRoad(x,y,w,h){
    const padding = 15;

    for(const road of roads){
        let minX = Math.min(road.x1, road.x2) - padding;
        let maxX = Math.max(road.x1, road.x2) + padding;
        let minY = Math.min(road.y1, road.y2) - padding;
        let maxY = Math.max(road.y1, road.y2) + padding;

        if(
            x < maxX &&
            x+w > minX &&
            y < maxY &&
            y+h > minY
        ){
            return true;
        }
    }

    return false;
}
function startDrag(e){
    dragging = true;
    cameraFollowing = false;
    dragDistance = 0;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.style.cursor = "grabbing";
}
function dragCamera(e){
    if(!dragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    dragDistance += Math.hypot(dx, dy);
    camera.x += dx;
    camera.y += dy;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
}
function stopDrag(){
    dragging = false;
    setTimeout(() => {dragDistance = 0;}, 0);
    canvas.style.cursor = hoverBuilding ? "pointer" : "grab";
}
function drawPlayer(){
    player.pulse += 0.05;
    const radius = player.radius + Math.sin(player.pulse) * 1.2;
    const screenX = player.x;
    const screenY = player.y;
    ctx.save();
    ctx.beginPath();
    ctx.arc(
        screenX,
        screenY,
        radius,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = "#00ff66";
    ctx.shadowColor = "#00ff44";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();
    console.log(player.x, player.y, camera.x, camera.y);
}
function overlaps(x, y, w, h){
    for(const b of buildings){
        if(x<b.x+b.width+40 &&
           x+w>b.x-40 &&
           y<b.y+b.height+15 &&
           y+h>b.y-15 
        ){
            return true;
        }
    }
    return false;
}
function spawnBuilding(memoryIndex, retries = 0){
    const memory = memories[memoryIndex];
    const chars = memory.text.trim().length;
    let width, height;
    if(chars <= 30){
        width = 55;
        height = 55;
    }
    else if(chars <= 80){
        width = 70;
        height = 70;
    }
    else if(chars <= 150){
        width = 85;
        height = 90;
    }
    else if(chars <= 300){
        width = 105;
        height = 120;
    }
    else if(chars <= 500){
        width = 125;
        height = 145;
    }
    else{
        width = 145;
        height = 170;
    }
    const branch = createBuildingBranch();
    if(!branch) return;
    const node = branch.node;
    node.hasBuilding = true;
    node.reserved = false;
    const perp = branch.angle + Math.PI/2;
    let side = Math.random()<0.5 ? -1 : 1;
    let distance = 100;
    let x,y;
    while(true){
        x = node.x + Math.cos(perp) * distance * side - width/2;
        y = node.y + Math.sin(perp) * distance * side - height/2;
        const roadEndX = node.x + Math.cos(perp)*distance*side;
        const roadEndY = node.y + Math.sin(perp)*distance*side;
        if(
            !overlaps(x,y,width,height) &&
            !buildingHitsRoad(x,y,width,height) &&
            !roadHitsBuilding(node.x,node.y,roadEndX,roadEndY)
        ){
            break;
        }
        console.log("rejected:", distance, overlaps(x,y,width,height),buildingHitsRoad(x,y,width,height),roadHitsBuilding(node.x,node.y,roadEndX,roadEndY));
        distance += 50
        if(distance > 600){
            roads.pop();
            const parent = node.parent;
            const i = roadNodes.indexOf(node);
            if(i !== -1){
                roadNodes.splice(i, 1);
            }
            const c = parent.children.indexOf(node);
            if(c !== -1){
                parent.children.splice(c, 1);
            }
            if(retries >= 20){
                console.log("building placement failed ;-;");
                return;
            }
            return spawnBuilding(memoryIndex, retries + 1);
        }
    }
    let endX = node.x + Math.cos(perp)*distance*side;
    let endY = node.y + Math.sin(perp)*distance*side;
    let road = new Road(node.x, node.y, endX, endY, null, false);
    if(distance > 150){
        if(Math.abs(endX - node.x) > Math.abs(endY - node.y)){
            road.bend = {
                x:(node.x + endX) / 2,
                y:node.y
            };
        }
        else{
            road.bend = {
                x:node.x,
                y:(node.y + endY) / 2
            };
        }
    }
    roads.push(road);
    buildings.push(new Building(x, y, width, height, emotionColors[memory.emotion], memoryIndex));
}
function clickBuilding(e){
    if(dragDistance > DRAG_THRESHOLD) return;
    const rect = canvas.getBoundingClientRect();
    const mouse = screenToWorld(
        e.clientX-rect.left,
        e.clientY-rect.top
    );
    for(const building of buildings){
        if(mouse.x >= building.x &&
           mouse.x <= building.x + building.width &&
           mouse.y >= building.y &&
           mouse.y <= building.y + building.height
        ){
            journalModal.classList.remove("hidden");
            openEditor(building.memoryID);
            return;
        }
    }
}
function updateHoveredBuilding(e){
    if(dragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouse = screenToWorld(e.clientX-rect.left,
                                e.clientY-rect.top       
                                );
    hoverBuilding = null;
    for(const building of buildings){
        if(mouse.x >= building.x &&
           mouse.x <= building.x + building.width &&
           mouse.y >= building.y &&
           mouse.y <= building.y + building.height
        ){
            hoverBuilding = building;
            canvas.style.cursor = "pointer";
            return;
        }
    }
    canvas.style.cursor = "grab";
}
function drawStats(){
    pieCtx.clearRect(0,0,pieChart.width,pieChart.height);
    const counts = {};
    memories.forEach(memory => {
        counts[memory.emotion] =
            (counts[memory.emotion] || 0) + 1;
        });
    const total = memories.length;
    const radius = 120;
    if(total === 0){
        pieCtx.fillStyle = "white";
        pieCtx.font = "18px Consolas";
        pieCtx.textAlign = "center";
        pieCtx.fillText("No Nemories Yet...",150,140);
        pieCtx.font = "16px Consolas";
        pieCtx.fillStyle = "#aaa";
        pieCtx.fillText("But you can change that!",150,170);
        return;
    }
    let start = -Math.PI/2;
    let startAngle = 0;
    let index = 0;
    Object.keys(counts).forEach(emotion => {
        const amount = counts[emotion];
        const slice = amount/total*Math.PI*2;
        const mid = startAngle + slice/2;
        const offset = index === hoveredSlice ? 15 : 0;
        const cx = 150 + Math.cos(mid) * offset;
        const cy = 150 + Math.sin(mid) * offset;
        pieCtx.beginPath();
        pieCtx.moveTo(cx, cy);
        pieCtx.arc(cx, cy, radius, startAngle, startAngle + slice);
        pieCtx.closePath();
        pieCtx.fillStyle = emotionColors[emotion];
        if(index === hoveredSlice){
            pieCtx.shadowColor = emotionColors[emotion];
            pieCtx.shadowBlur = 18;
        }
        else{
            pieCtx.shadowBlur = 0;
        }
        pieCtx.fill();
        if(index === hoveredSlice){
            const percent = Math.round(amount/total*100);
            if(percent < 6){
                const x1 = cx + Math.cos(mid) * radius;
                const y1 = cy + Math.sin(mid) * radius;
                const x2 = cx + Math.cos(mid) * (radius + 18);
                const y2 = cy + Math.sin(mid) * (radius + 18);
                pieCtx.strokeStyle = "#ccc";
                pieCtx.lineWidth = 2;
                pieCtx.beginPath();
                pieCtx.moveTo(x1,y1);
                pieCtx.lineTo(x2,y2);
                pieCtx.stroke();
                pieCtx.fillStyle = "#fff";
                pieCtx.font = "bold 16px Consolas";
                pieCtx.textAlign = Math.cos(mid) > 0 ? "left" : "right";
                pieCtx.fillText(percent + "%", x2+(Math.cos(mid) > 0 ? 8 : -8), y2);
                startAngle += slice;
                return;
            }
            const color = emotionColors[emotion];
            const rgb = color.match(/\w\w/g).map(v => parseInt(v, 16));
            const brightness = (rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000;
            pieCtx.fillStyle = brightness > 170 ? "#111" : "#fff";
            pieCtx.font = "bold 18px Consolas";
            pieCtx.textAlign = "center";
            pieCtx.textBaseline = "middle";
            pieCtx.shadowBlur = 0;
            const textRadius = radius * 0.62;
            pieCtx.fillText(percent + "%", cx+Math.cos(mid)*textRadius, cy+Math.sin(mid)*textRadius);
        }
        startAngle += slice;
        index++;
    });
    pieCtx.beginPath();
    pieCtx.arc(150,150,45,0,Math.PI*2);
    pieCtx.fillStyle="#1b1b1b";
    pieCtx.fill();
    pieCtx.fillStyle="white";
    pieCtx.font="bold 24px Consolas";
    pieCtx.textAlign="center";
    pieCtx.fillText(total,150,145);
    pieCtx.font="12px Consolas";
    pieCtx.fillStyle="#999";
    pieCtx.fillText(total===1 ? "Nemory" : "Nemories", 150, 168);
    drawLegend(counts);
}
function drawLegend(counts){
    statsLegend.innerHTML="";
    Object.keys(counts).forEach(emotion=>{
        const div=document.createElement("div");
        div.className="legendItem";
        const name = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        div.innerHTML=`
        <span class="legendColor" style="background:${emotionColors[emotion]}"></span>
        ${name}: ${counts[emotion]}`;
        statsLegend.appendChild(div);
    });
}
function drawMoodGraph(){
    moodCtx.clearRect(0,0,moodChart.width,moodChart.height);
    const history = getMoodHistory();
    moodHistoryCache=history;
    console.log(history);
    if(history.length===0){
        moodCtx.fillStyle="white";
        moodCtx.font = "18px Consolas";
        moodCtx.textAlign="center";
        moodCtx.fillText("No Mood Data Yet...",moodChart.width/2,moodChart.height/2);
        return;
    }
    const padding = 50;
    const width = moodChart.width-padding*2;
    const height = moodChart.height-padding*2;
    moodCtx.strokeStyle="#333";
    moodCtx.lineWidth=1;
    for(let i=0;i<=6;i++){
        let y = padding+(height/6)*i;
        moodCtx.beginPath();
        moodCtx.moveTo(padding,y);
        moodCtx.lineTo(padding+width,y);
        moodCtx.stroke();
    }
    function moodToY(value){
        return padding+((3-value)/6)*height;
    }
    moodCtx.beginPath();
    const graphPoints = [];
    history.forEach((point,index)=>{
        const x =padding+(index/(history.length-1 || 1))*width;
        const y = moodToY(point.mood);
        if(index===0){
            moodCtx.moveTo(x,y);
        }
        else{
            moodCtx.lineTo(x,y);
        }
    });
    moodCtx.strokeStyle="#ffffff";
    moodCtx.lineWidth=3;
    moodCtx.shadowColor="#ffffff";
    moodCtx.shadowBlur=12;
    moodCtx.stroke();
    moodCtx.shadowBlur=0;
    history.forEach((point,index)=>{
        const x =padding+(index/(history.length-1 || 1))*width;
        const y =moodToY(point.mood);
        graphPoints.push({x,y,data:point});
        let color;
        if(point.mood>1){
            color="#47ff6b";
        }
        else if(point.mood<-1){
            color="#66c8ff";
        }
        else{
            color="#ffffff";
        }
        moodCtx.beginPath();
        const size = (index===hoveredMoodPoint) ? 10 : 6;
        moodCtx.arc(x,y,size,0,Math.PI*2);
        moodCtx.fillStyle=color;
        moodCtx.shadowColor=color;
        moodCtx.shadowBlur=10;
        moodCtx.fill();
        moodCtx.shadowBlur=0;
    });
    moodCtx.fillStyle="#999";
    moodCtx.font="12px Consolas";
    moodCtx.textAlign="right";
    moodCtx.fillText("+3",padding-10,moodToY(3)+5);
    moodCtx.fillText("0",padding-10,moodToY(-3)+5);
}
moodChart.addEventListener("mousemove",e=>{
    const rect = moodChart.getBoundingClientRect();
    const scaleX = moodChart.width / rect.width;
    const scaleY = moodChart.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const history=moodHistoryCache;
    const padding = 60;
    const width = moodChart.width-padding*2;
    const height = moodChart.height-padding*2;
    function moodToY(value){
        return padding + ((3-value)/6)*height;
    }
    hoveredMoodPoint=null;
    history.forEach((point,index)=>{
        const x = history.length===1 ? moodChart.width/2 : padding+(index/(history.length-1))*width;
        const y = moodToY(point.mood);
        const distance=Math.sqrt((mouseX-x)**2+(mouseY-y)**2);
        if(distance<12){
            hoveredMoodPoint=index;
            document.getElementById("moodInfo").innerHTML=
            `<b>${point.day}</b><br>
            Average Mood: ${point.mood.toFixed(2)}; Nemories: ${point.count}`;
        }
    });
    if(hoveredMoodPoint===null){
        document.getElementById("moodInfo").innerHTML = "Hover over a point...";
    }
    drawMoodGraph();
});
moodChart.addEventListener("mouseleave",()=>{
    hoveredMoodPoint=null;
    document.getElementById("moodInfo").innerHTML="Hover over a point...";
    drawMoodGraph;
})
function render(){
    const moved = updatePlayer();
    if(cameraFollowing){
        camera.x += (-player.x - camera.x) * 0.12;
        camera.y += (-player.y - camera.y) * 0.12;
    }
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    buildings.forEach(building=>{
        building.update();
    })
    flocks.forEach(f=>f.update());
    flocks.forEach(flock=>{
        if(flock.state !== "landed") return;
        const dx=mouse.x-flock.x;
        const dy=mouse.y-flock.y;
        if(Math.hypot(dx,dy)<180){
            flock.scare();
        }
    });
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(camera.x, camera.y);

    drawBirds();
    drawRoads();
    drawBuildings();
    drawBuildingLabels();
    drawPlayer();
    ctx.restore();

    requestAnimationFrame(render);
}
function rebuildWorld(){
    buildings.length = 0;
    roads.length = 0;
    roadNodes.length = 0;
    const rootNode = new RoadNode(0,0);
    roadNodes.push(rootNode);
    player.x = 0;
    player.y = 0;
    createRoadNode(rootNode, -Math.PI/2, 120);
    memories.forEach((memory,index)=>{
        spawnBuilding(index);
    });
    flocks.length=0;
    for(let i=0;i<4;i++){
        const b=buildings[Math.floor(Math.random()*buildings.length)];
        if(!b) continue;
        flocks.push(new Flock(b.x+b.width/2,b.y+b.height+25,3+Math.floor(Math.random()*4)));
    }
}
function saveWorld(){
    localStorage.setItem("nemoriesSave",JSON.stringify({memories,camera}));
}
function loadWorld(){
    const save = JSON.parse(localStorage.getItem("nemoriesSave"));
    if(!save) return;
    memories.length = 0;
    memories.push(...save.memories);
    memories.forEach(memory=>{
        if(!memory.date){
            memory.date=new Date().toISOString();
        }
    });
    if(save.camera){
        camera.x = save.camera.x;
        camera.y = save.camera.y;
    }
    saveWorld();
    rebuildWorld();
}

canvas.addEventListener("mousedown",()=>{
    
});

statsButton.onclick = () => {
    statsModal.classList.remove("hidden");
    drawStats();
};
closeStats.onclick = () => {
    statsModal.classList.add("hidden");
};
pieChart.addEventListener("mousemove", e => {
    const rect = pieChart.getBoundingClientRect();
    const x = e.clientX - rect.left - 150;
    const y = e.clientY - rect.top - 150;
    const distance = Math.hypot(x, y);
    if(distance > 120){
        hoveredSlice = -1;
        drawStats();
        return;
    }
    let angle = Math.atan2(y, x);
    if(angle < 0)
        angle += Math.PI*2;
    const counts = {};
    memories.forEach(m => {
        counts[m.emotion] = (counts[m.emotion] || 0) +1;
    });
    const total = memories.length;
    let start = 0;
    let index = 0;
    hoveredSlice = -1;
    for(const emotion in counts){
        const slice = counts[emotion]/total*Math.PI*2;
        if(angle >= start && angle <= start + slice){
            hoveredSlice = index;
            break;
        }
        start += slice;
        index++;
    }
    drawStats();
});
moodButton.onclick=()=>{
    moodModal.classList.remove("hidden");
    drawMoodGraph();
};
closeMood.onclick=()=>{
    moodModal.classList.add("hidden");
}
aboutButton.addEventListener("click",()=>{
    aboutModal.classList.remove("hidden");
});
closeAbout.addEventListener("click",()=>{
    aboutModal.classList.add("hidden");
});
githubButton.addEventListener("click",()=>{
    shell.openExternal("https://github.com/adonutartist/Nemories");
})
pieChart.addEventListener("mouseleave", () => {
    hoveredSlice = -1;
    drawStats();
})
noteButton.addEventListener("click", () => {
    journalModal.classList.remove("hidden");
    showList();
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
closeJournal.addEventListener("click", () => {
    journalModal.classList.add("hidden");
});
closeEditor.addEventListener("click", () => {
    journalModal.classList.add("hidden");
});
canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    if(e.deltaY < 0){
        camera.zoom += zoomSpeed;
    }
    else{
        camera.zoom -= zoomSpeed;
    }
    camera.zoom = Math.max(0.4, Math.min(camera.zoom, 3));
});
canvas.addEventListener("click", clickBuilding);
canvas.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", e => {dragCamera(e); updateHoveredBuilding(e);
    const rect = canvas.getBoundingClientRect();
    mouse = screenToWorld(
        e.clientX - rect.left,
        e.clientY - rect.top
    );
});
window.addEventListener("mouseup", stopDrag);
emotionButtons[0].classList.add("selected");
const rootNode = new RoadNode(0, 0);
roadNodes.push(rootNode);
player.x = 0;
player.y = 0;
document.addEventListener("mousemove",e=>{
    const target = e.target.closest(
        "button, .emotion, .memoryCard, #addMemory"
    );
    if(!target){
        lastHoveredElement=null;
        return;
    }
    if(target!==lastHoveredElement){
        lastHoveredElement=target;
        playHoverSound();
    }
})
createRoadNode(rootNode, -Math.PI/2, 120);

loadWorld();
render();