const electron = require('electron')
const dialog = electron.dialog;
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const chokidar = require('chokidar')
const fs = require('fs')

var ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow();
  mainWindow.setMenu(null);
  mainWindow.setFullScreen(true);

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Load Codemap
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  }, function(dir){
    WATCH_DIR = dir[0];
    CODE_MAP_PATH = WATCH_DIR + '\\.codemap';
    getCodeMap();
    chokidar.watch(WATCH_DIR, {ignoreInitial: true, ignored: /(^|[\/\\])\../}).on('add', (path, event) => {
      var code = generateCode();
      path = path.replace(WATCH_DIR+'\\','');
      code_map[code] = path;
      codes++;
      mainWindow.webContents.send('new-file', code);
      mainWindow.webContents.send('code_count', codes);
      fs.appendFile(CODE_MAP_PATH, code+':'+path+'|');
    });

  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var code_map = null;
var CODE_MAP_PATH;
var WATCH_DIR;
var codes = 0;

function getCodeMap (cb){
  fs.readFile(CODE_MAP_PATH, 'utf8', (err, data) => {
    code_map = {};
    if(data){
      data = data.split('|');
      for(var i=0; i<data.length; i++){
        if(data[i].length>0){
          var pair = data[i].split(':');
          code_map[pair[0]] = pair[1];
          codes++;
        }
      }
    }
    if(cb){cb();}
  });
};

function generateCode(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  if(code_map[text]){
    return generateCode();
  }
  else{
    return text;
  }
};


// IPC
ipcMain.on('get-image', function(event, code){
  var imageurl = code_map[code.trim()];
  if(!imageurl){
    imageurl = 'Invalid Code'
  }
  event.sender.send('image-url', imageurl)
});
