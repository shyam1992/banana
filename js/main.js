const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron')
const path = require('path')
const url = require('url');
const fs = require('fs');
let menu;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
function createWindow () {
  // Create the browser window.
const screen = require('electron').screen
const display = screen.getPrimaryDisplay();
win = new BrowserWindow({width: display.size.width, height: display.size.height,frame:true})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }));
  AttachMenuToWindow();
  // Open the DevTools.
  //win.webContents.openDevTools()
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// var openNewTab = function(){
//    win.webContents.send('NewTab','');
// };
var OpenFileFromDir = function(){
    var result = dialog.showOpenDialog({properties:['openFile'],filters:[{name:'json',extensions:['json']}]});
    if(result !== null && result != undefined && result !== ''){
      fs.readFile(result[0],'utf8',function(err,data){
      if(err){
        dialog.showErrorBox('Failed','Cannot open the file!');
        console.log(err);
      }else{
        win.webContents.send('openFile',data,result[0]);
      }
    });
    }
};
var SaveFileToDir = function(){
 win.webContents.send('getCurrentTabDetails','save');
};
ipcMain.on('saveFile',(event,arg) => {
      if(arg.fileName === undefined) return;
      fs.writeFile(arg.fileName,arg.fileContent,function(err){
        if(err){
             console.log(err);
             dialog.showErrorBox('Failed','Cannot save the file!');
        }
      });
}); 
var SaveAsFileToDir = function(){
     win.webContents.send('getCurrentTabDetails','saveAs');
};
ipcMain.on('saveAsFile',(event,arg) => {
    dialog.showSaveDialog({filters:[{
      name:"json", extensions:['json']
    }]},function(fileName){
       if(fileName === undefined) return;
       fs.writeFile(fileName,arg,function(err){
          if(err){
            console.log(err);
            dialog.showErrorBox('Failed','Cannot save the file!');
          }
       });
    });
});
ipcMain.on('disableMenu',(event,arg) => {
  if(arg == "NewTab"){
    menu.items[0].submenu.items[0].enabled = false;
  }
});
ipcMain.on('enableMenu',(event,arg) => {
  if(arg == "NewTab"){
    menu.items[0].submenu.items[0].enabled = true;
  }
});
const template = [
{
    label: 'File',
    submenu: [
      {
        label: 'New tab',
        accelerator:'CommandOrControl+n',
        click: function() {  win.webContents.send('NewTab','');}
      },{
        label: 'Open',
        accelerator:'CommandOrControl+o',
        click: function() { OpenFileFromDir();}
      },{
        label: 'Save',
        accelerator:'CommandOrControl+s',
        click: function() { SaveFileToDir();}
      },{
        label: 'Save As',
        accelerator:'CommandOrControl+Shift+s',
        click: function() { SaveAsFileToDir();}
      },{
        label: 'Close tab',
        accelerator:'CommandOrControl+w',
        click: function() { win.webContents.send('CloseTab','');}
      },{
        label: 'Close all tabs',
        accelerator:'CommandOrControl+Shift+w',
        click: function() { win.webContents.send('CloseAllTab','');}
      },{
        label: 'Exit',
        role:'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label:'Reload',
        role: 'reload'
      },
      {type: 'separator'},
      //{role: 'forcereload'},
      {
        label:'Dev Tools',
        role: 'toggledevtools'
      },
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electron.atom.io') }
      }
    ]
  }
];
AttachMenuToWindow = function(){
  if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })
}
menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
};

