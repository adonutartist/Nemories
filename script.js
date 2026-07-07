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
const roads = [];
const buildings = [];
const intersections = [];
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
emotionButtons[0].classList.add("selected");
intersections.push(new Intersection(0, 0));
roads.push(new Road(0, 0, 0, -120));
buildings.push(new Building(-25, -180, 50, 50, "#FFD54F"));
render();