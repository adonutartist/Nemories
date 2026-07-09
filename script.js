const canvas = document.getElementById("worldCanvas");
const ctx = canvas.getContext("2d");
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
const pieChart = document.getElementById("pieChart");
const pieCtx = pieChart.getContext("2d");
const statsLegend = document.getElementById("statsLegend");
let memories = JSON.parse(localStorage.getItem("memories")) || [];
let selectedEmotion = "happy";
let editIndex = null;
let hoverBuilding = null;
const emotionColors = {
    happy:"#47ff6b",
    excited:"#ffe84d",
    loving:"#ff63d5",
    neutral:"#ffffff",
    sad:"#66c8ff",
    angry:"#ff5050",
    tired:"#a78bfa"
};
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
        emotion: selectedEmotion
    };
    if(editIndex !== null){
        memories[editIndex] = data;
    }
    else{
        memories.push(data);
    }
    localStorage.setItem("memories", JSON.stringify(memories));
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
const intersections = [];
const roadNodes = [];
const player = {x: 0, y: 0, radius: 6, pulse: 0};
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
}
function drawRoads(){
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#555";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    roads.forEach(road => {
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 + road.x1, canvas.height/2 + road.y1);
        if(road.bend){
            ctx.lineTo(
                canvas.width/2+road.bend.x,
                canvas.height/2+road.bend.y
            );
        }
        ctx.lineTo(canvas.width/2+road.x2, canvas.height/2+road.y2);
        if(!isRoadEndConnected(road)){
            let gradient = ctx.createLinearGradient(
                canvas.width/2+road.x1,
                canvas.height/2 + road.y1,
                canvas.width / 2 + road.x2,
                canvas.height/2+road.y2
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
        ctx.fillRect(canvas.width/2 + building.x, canvas.height/2 + building.y, building.width, building.height);
        ctx.strokeStyle = building.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width/2 + building.x, canvas.height/2 + building.y, building.width, building.height);
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
    const x = canvas.width/2 + hoverBuilding.x + hoverBuilding.width/2;
    const y = canvas.height/2 + hoverBuilding.y - 12;
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
function screenToWorld(x, y){
    return{
        x: x-canvas.width/2-camera.x,
        y: y-canvas.height/2-camera.y
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

    const screenX = canvas.width/2 + player.x;
    const screenY = canvas.height/2 + player.y;

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
    if(total === 0){
        pieCtx.fillStyle = "white";
        pieCtx.font = "18px Consolas";
        pieCtx.textAlign = "center";
        pieCtx.fillText("No Nemories Yet... But you can change that!", 150, 150);
        return;
    }
    let start = -Math.PI/2;
    Object.entries(counts).forEach(([emotion,count]) => {
        const angle = count/total*Math.PI*2;
        pieCtx.beginPath();
        pieCtx.moveTo(150,150);
        pieCtx.arc(150,150,115,start+0.02,start+angle-0.02);
        pieCtx.closePath();
        pieCtx.fillStyle = emotionColors[emotion];
        pieCtx.shadowColor = emotionColors[emotion];
        pieCtx.shadowBlur = 10;
        pieCtx.fill();
        pieCtx.lineWidth = 2;
        pieCtx.strokeStyle = "#111";
        pieCtx.stroke();
        const mid = start+angle/2;
        const tx = 150+Math.cos(mid)*78;
        const ty = 150+Math.sin(mid)*78;
        pieCtx.shadowBlur = 0;
        pieCtx.fillStyle = "white";
        pieCtx.font = "bold 14px Consolas";
        pieCtx.textAlign = "center";
        pieCtx.fillText(Math.round(count/total*100)+"%",tx,ty);
        start+=angle;
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
function render(){
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(camera.x, camera.y);
    ctx.translate(-canvas.width/2, -canvas.height/2);
    drawRoads();
    drawBuildings();
    drawBuildingLabels();
    drawPlayer();
    ctx.restore();
    requestAnimationFrame(render);
}
statsButton.onclick = () => {
    statsModal.classList.remove("hidden");
    drawStats();
};
closeStats.onclick = () => {
    statsModal.classList.add("hidden");
};
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
})
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
window.addEventListener("mousemove", e => {dragCamera(e); updateHoveredBuilding(e);});
window.addEventListener("mouseup", stopDrag);
emotionButtons[0].classList.add("selected");
const rootNode = new RoadNode(0, 0);
roadNodes.push(rootNode);
player.x = 0;
player.y = 0;
createRoadNode(rootNode, -Math.PI/2, 120);
render();