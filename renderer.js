// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var ipcRenderer = require('electron').ipcRenderer;


ipcRenderer.on('new-file', function(event, data){
  document.getElementById('your-code-is').style.display = 'block';
  document.getElementById('codestring').style.display = 'block';
  document.getElementById('codestring').innerHTML = data;
});
ipcRenderer.on('code_count', function(event, data){
  document.getElementById('codecount').innerHTML = 'Codes: ' + data;
});

ipcRenderer.on('image-url', function(event, data){
  document.getElementById('imageurl').innerHTML = 'URL: ' + data;
});

global.getCode = function(){
  var code = document.code_form.code.value;
  ipcRenderer.send('get-image', code);
};
