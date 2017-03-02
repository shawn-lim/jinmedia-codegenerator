// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var ipcRenderer = require('electron').ipcRenderer;

angular.module('CodeGenerator', []);

angular.module('CodeGenerator')
  .controller('MainCtrl', function($scope, $timeout){

    var vm = this;
    angular.extend(vm, {
      codes: [],
      code_history_toggle: false,
      current_code: null,
      code_count: null,
      image_url: null,

      getCode: function(){
        var code = document.code_form.code.value;
        ipcRenderer.send('get-image', code);
      }
    });

    ipcRenderer.on('new-file', function(event, data){
      $timeout(function(){
        vm.current_code = data.code;
        if(vm.codes.length > 2){
          vm.codes.shift();
        }
        vm.codes.push(data);
      })
    });
    ipcRenderer.on('code_count', function(event, data){
      $timeout(function(){
        vm.code_count = data;
      });
    });

    ipcRenderer.on('image-url', function(event, data){
      $timeout(function(){
        vm.image_url = data;
      });
    });

  });


document.addEventListener('dragover',function(event){
  event.preventDefault();
  return false;
},false);

document.addEventListener('drop',function(event){
  event.preventDefault();
  return false;
},false);
