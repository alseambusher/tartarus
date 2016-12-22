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
var onFileChange = require("on-file-change");
import { default as drawer } from "./drawer";
import { default as dialogs} from "./dialogs";
import { set_current_content, get_current_content } from "./instance";
import * as tartarus from "./lib/tartarus";

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

tartarus.load();
document.addEventListener('DOMContentLoaded', function () {
  set_current_content("Files");
  drawer(document.querySelector(".mdl-layout__drawer"));
  dialogs();
  // show the landing page
  document.getElementById("content_" + get_current_content()).style.display = "inline";
  // refresh
  document.querySelectorAll("#button_refresh").forEach((button) => {
    button.onclick = () => {
      tartarus.files.reload();
      UI_set_files_page();
      tartarus.schedules.reload();
      UI_set_schedules_page();
    };
  });
  // force count
  tartarus.settings.force((count) => {
    document.getElementById("force_count_badge").setAttribute("data-badge", count);
  });
  tartarus.files.ui_update = UI_set_files_page;
  tartarus.schedules.ui_update = UI_set_schedules_page;
  tartarus.settings.ui_update = UI_set_settings_page;
  // TODO auto refresh - fs.watch is too unpredictable
  // fs.watch(path.join(__dirname, "db"), function(event, targetfile){
  //   if (event == "change"){
  //     if (targetfile == path.basename(tartarus.filesDbFile)){
  //       tartarus.files.reload();
  //       UI_set_files_page();
  //     } else if (targetfile == path.basename(tartarus.schedulesDbFile)){
  //       tartarus.schedules.reload();
  //       UI_set_schedules_page();
  //     }
  //   }
  // });
  //
  document.querySelectorAll('.mdl-data-table').forEach((table) => {
    let headerCheckbox = table.querySelector('thead .mdl-data-table__select input');
    headerCheckbox.addEventListener('change', headerCheckHandler);
  });
  UI_set_files_page();
  UI_set_schedules_page();
});

var headerCheckHandler = function(event) {
  document.querySelectorAll('#content_'+ get_current_content() +' table tbody').forEach((tbody) => {
    let boxes = tbody.querySelectorAll(".mdl-data-table__select");
    if (event.target.checked) {
      for (let i = 0, length = boxes.length; i < length; i++) {
        boxes[i].MaterialCheckbox.check();
      }
    } else {
      for (let i = 0, length = boxes.length; i < length; i++) {
        boxes[i].MaterialCheckbox.uncheck();
      }
    }
  });
};

function UI_set_files_page(){
  let table = document.querySelector("#content_Files tbody");
  table.innerHTML = '';
  tartarus.files.files((docs)=> {
    let done = [];
    docs.forEach((doc) => {
      let tr = document.createElement("tr");
      if (doc.done)
        tr.className = "done mdl-color--green-600";
      tr.innerHTML = '<td><label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="Files-'+ doc._id +'"><input type="checkbox" id="Files-'+ doc._id +'" class="mdl-checkbox__input" /></label></td>';
      let tdFilename = document.createElement("td");
      tdFilename.className = "mdl-data-table__cell--non-numeric";
      tdFilename.innerHTML = path.basename(doc.filename);
      let tdLocation = document.createElement("td");
      tdLocation.className = "mdl-data-table__cell--non-numeric";
      tdLocation.innerHTML = path.dirname(doc.filename);
      let tdTime = document.createElement("td");
      tdTime.className = "mdl-data-table__cell--non-numeric";
      tdTime.innerHTML = new Date(doc.unlockTime).toLocaleString();
      tr.appendChild(tdFilename);
      tr.appendChild(tdLocation);
      tr.appendChild(tdTime);
      // put the doc which is done at the end of the table
      if (doc.done)
        done.push(tr);
      else
        table.appendChild(tr);
    });
    done.forEach((tr) => {
      table.appendChild(tr);
    });
    componentHandler.upgradeAllRegistered();
  });
}

function UI_set_schedules_page(){
  let table = document.querySelector("#content_Schedules tbody");
  table.innerHTML = '';
  tartarus.schedules.files((docs)=> {
    let done = [];
    docs.forEach((doc) => {
      let tr = document.createElement("tr");
      if (doc.done)
        tr.className = "done mdl-color--green-600";
      else if (doc.locked)
        tr.className = "locked";

      tr.innerHTML = '<td><label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="Schedules-'+ doc._id +'"><input type="checkbox" id="Schedules-'+ doc._id +'" class="mdl-checkbox__input" /></label></td>';
      let tdFilename = document.createElement("td");
      tdFilename.className = "mdl-data-table__cell--non-numeric";
      tdFilename.innerHTML = path.basename(doc.filename);
      let tdLocation = document.createElement("td");
      tdLocation.className = "mdl-data-table__cell--non-numeric";
      tdLocation.innerHTML = path.dirname(doc.filename);
      let tdLockTime = document.createElement("td");
      tdLockTime.className = "mdl-data-table__cell--non-numeric";
      tdLockTime.innerHTML = new Date(doc.lockTime).toLocaleString();
      let tdTime = document.createElement("td");
      tdTime.className = "mdl-data-table__cell--non-numeric";
      tdTime.innerHTML = new Date(doc.unlockTime).toLocaleString();
      tr.appendChild(tdFilename);
      tr.appendChild(tdLocation);
      tr.appendChild(tdLockTime);
      tr.appendChild(tdTime);
      // put the doc which is done at the end of the table
      if (doc.done)
        done.push(tr);
      else
        table.appendChild(tr);
    });
    done.forEach((tr) => {
      table.appendChild(tr);
    });
    componentHandler.upgradeAllRegistered();
  });
}

function UI_set_settings_page(){
}
