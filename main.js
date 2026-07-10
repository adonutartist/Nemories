const {app, BrowserWindow, ipcMain} = require("electron");
let mainWindow;
let widgetWindow;
function createWindow(){
    mainWindow = new BrowserWindow({
        width: 900,
        height: 650,
        backgroundColor: "#111111",
        title: "Nemories",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile("index.html");
}
function createWidget(){
    if(widgetWindow){
        widgetWindow.focus();
        return;
    }
    widgetWindow = new BrowserWindow({
        width: 270,
        height: 270,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {nodeIntegration:true, contextIsolation:false}
    });
    widgetWindow.loadFile("widget.html");
    widgetWindow.on("closed",()=>{
        widgetWindow=null;
    });
}
ipcMain.on("open-widget",()=>{
    console.log("open-widget");
    createWidget();
});
app.whenReady().then(()=>{
    createWindow();
});