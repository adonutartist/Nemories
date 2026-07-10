const {ipcRenderer} = require("electron");
document.getElementById("closeBtn").onclick = () => {
    ipcRenderer.send("close-widget"); 
}