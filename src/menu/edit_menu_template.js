/*jshint esversion: 6 */
var open = require('open');
import { app } from 'electron';

export var editMenuTemplate = {
  label: 'Help',
  submenu: [
    { label: "View License", click() { open("https://github.com/alseambusher/tartarus/LICENCE.md");}},
    { label: "Documentation", click() { open("https://github.com/alseambusher/tartarus/README.md");}},
    { label: "Issues", click() { open("https://github.com/alseambusher/tartarus/issues");}},
    { type: "separator" },
    { label: "About", click() { open("http://github.com/alseambusher");}},
  ]
};

export var fileMenuTemplate = {
  label: "File",
  submenu: [
    { label: "Exit", accelerator: 'CmdOrCtrl+Q', click(){ app.quit(); } },
  ]
};
