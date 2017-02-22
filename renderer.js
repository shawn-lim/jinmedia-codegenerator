// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('new-file', function(event, data){
  console.log(data);
  document.getElementById('codestring').innerHTML = data;
});
