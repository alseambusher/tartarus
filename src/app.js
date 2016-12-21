/*jshint esversion: 6 */
import os from 'os';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';
var path = require("path");
var fs = require("fs");
var dialogPolyfill = require("dialog-polyfill");
const {ipcRenderer} = require('electron');
var glob = require("glob");
import { default as drawer } from "./drawer";
import { default as dialogs} from "./dialogs";
import { set_current_content } from "./instance";
import * as tartarus from "./lib/tartarus";

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

document.addEventListener('DOMContentLoaded', function () {
  set_current_content("Files");
  drawer(document.querySelector(".mdl-layout__drawer"));
  dialogs();
  tartarus.files.ui_update = UI_set_files_page;
  tartarus.schedules.ui_update = UI_set_schedules_page;
  tartarus.settings.ui_update = UI_set_settings_page;
  fs.watchFile(__dirname + tartarus.filesDbFile, UI_set_files_page);
  fs.watchFile(__dirname + tartarus.schedulesDbFile, UI_set_schedules_page);
  fs.watchFile(__dirname + tartarus.settingsDbFile, UI_set_settings_page);
  UI_set_files_page();
});

function UI_set_files_page(){
  let table = document.querySelector("#content_Files tbody");
  table.innerHTML = '';
  tartarus.files.files((docs)=> {
    docs.forEach((doc) => {
      let tr = document.createElement("tr");
      tr.innerHTML = '<td><label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" class="mdl-checkbox__input"><span class="mdl-checkbox__focus-helper"></span><span class="mdl-checkbox__box-outline"><span class="mdl-checkbox__tick-outline"></span></span><span class="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span class="mdl-ripple"></span></span></label></td>';
      let tdFilename = document.createElement("td");
      tdFilename.className = "mdl-data-table__cell--non-numeric";
      tdFilename.innerHTML = path.basename(doc.filename);
      let tdLocation = document.createElement("td");
      tdLocation.className = "mdl-data-table__cell--non-numeric";
      tdLocation.innerHTML = path.dirname(doc.filename);
      let tdTime = document.createElement("td");
      tdTime.className = "mdl-data-table__cell--non-numeric";
      tdTime.innerHTML = doc.unlockTime;
      tr.appendChild(tdFilename);
      tr.appendChild(tdLocation);
      tr.appendChild(tdTime);
      table.appendChild(tr);
    });
  });
}

function UI_set_schedules_page(){
  console.log("schedules changed");
}

function UI_set_settings_page(){
  console.log("settings changed");
}
