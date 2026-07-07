const {app, BrowserWindow} = require("electron");
function createWindow(){
    const win = new BrowserWindow({
        width: 900,
        height: 650,
        backgroundColor: "#111111",
        title: "Nemories",
        webPreferences: {nodeIntegration: true, contextIsolation: false}
    });
    win.loadFile("index.html");
}
app.whenReady().then(() => {createWindow()});