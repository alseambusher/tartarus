/*jshint esversion: 6 */

import { app, Menu } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate, fileMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';

// in config/env_xxx.json file.
import env from './env';

var mainWindow;

var setApplicationMenu = function () {
  var menus = [fileMenuTemplate, editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

if (env.name !== 'production') {
  var userDataPath = app.getPath('userData');
  app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
  setApplicationMenu();

  var mainWindow = createWindow('main', {
    width: 1200,
    height: 600
  });

  mainWindow.loadURL('file://' + __dirname + '/app.html');

  if (env.name === 'development') {
    mainWindow.openDevTools();
  }
});

app.on('window-all-closed', function () {
  app.quit();
});

app.on('before-quit', function(){
  // TODO
});
