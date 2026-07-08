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
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
class RoadNode{
    constructor(x, y, parent = null){
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.children = [];
        this.hasBuilding = false;
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
    roads.forEach(road => {
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 + camera.x + road.x1, canvas.height/2 + camera.y + road.y1);
        ctx.lineTo(canvas.width/2 + camera.x + road.x2, canvas.height/2 + camera.y + road.y2);
        ctx.stroke();
    });
}
function drawBuildings(){
    buildings.forEach(building => {
        ctx.save();
        if(building === hoverBuilding){
            ctx.shadowColor = building.color;
            ctx.shadowBlur = 18;
        }
        ctx.fillStyle = "#222";
        ctx.fillRect(canvas.width/2 + camera.x + building.x, canvas.height/2 + camera.y + building.y, building.width, building.height);
        ctx.strokeStyle = building.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width/2 + camera.x + building.x, canvas.height/2 + camera.y + building.y, building.width, building.height);
        ctx.restore();
    }); 
}
function drawBuildingLabels(){
    if(!hoverBuilding) return;
    const x = canvas.width/2 + camera.x + hoverBuilding.x + hoverBuilding.width/2;
    const y = canvas.height/2 + camera.y + hoverBuilding.y - 12;
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
    return roadNodes.filter(node => node.children.length < 3 && !node.hasBuilding);
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
    const screenX = canvas.width/2;
    const screenY = canvas.height/2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI*2);
    ctx.fillStyle = "#00ff66";
    ctx.shadowColor = "#00ff44";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();
}
function overlaps(x, y, w, h){
    for(const b of buildings){
        if(x<b.x+b.width+15&&
           x+w>b.x-15 &&
           y<b.y+b.height+15 &&
           y+h>b.y-15 
        ){
            return true;
        }
    }
    return false;
}
function spawnBuilding(memoryIndex){
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
    const branch = growRoad();
    if(!branch) return;
    const node = branch.junction;
    const perp = branch.angle + Math.PI/2;
    let side = Math.random()<0.5 ? -1 : 1;
    let distance = 100;
    let x,y;
    while(true){
        x = node.x + Math.cos(perp) * distance * side - width/2;
        y = node.y + Math.sin(perp) * distance * side - height/2;
        if(!overlaps(x, y, width, height)){
            break;
        }
        distance += 50
        if(distance > 600){
            return
        }
    }
    roads.push(new Road(node.x, node.y, node.x + Math.cos(perp)*distance*side, node.y + Math.sin(perp)*distance*side));
    node.hasBuilding = true;
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
function render(){
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawRoads();
    drawBuildings();
    drawBuildingLabels();
    drawPlayer();
    requestAnimationFrame(render);
}
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
canvas.addEventListener("click", clickBuilding);
canvas.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", e => {dragCamera(e); updateHoveredBuilding(e);});
window.addEventListener("mouseup", stopDrag);
emotionButtons[0].classList.add("selected");
const rootNode = new RoadNode(0, 0);
roadNodes.push(rootNode);
createRoadNode(rootNode, -Math.PI/2, 120);
render();