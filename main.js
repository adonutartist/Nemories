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
        width: 300,
        height: 300,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        hasShadow: false,
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
ipcMain.on("close-widget", () => {
    if(widgetWindow){
        widgetWindow.close();
        widgetWindow = null;
    }
})
app.whenReady().then(()=>{
    createWindow();
});