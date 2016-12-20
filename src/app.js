/*jshint esversion: 6 */
import os from 'os';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';
var tartarus = require('electron').remote.require('./tartarus');
var path = require("path");
var fs = require("fs");
var dialogPolyfill = require("dialog-polyfill");
const {ipcRenderer} = require('electron');
var glob = require("glob");
import { default as drawer } from "./drawer";
import { default as dialogs} from "./dialogs";
import { set_current_content } from "./instance";

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

document.addEventListener('DOMContentLoaded', function () {
  set_current_content("Files");
  drawer(document.querySelector(".mdl-layout__drawer"));
  dialogs();
});
