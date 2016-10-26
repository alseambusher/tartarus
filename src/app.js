/*jshint esversion: 6 */
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
var tartarus = require('electron').remote.require('./tartarus');
var path = require("path");
var fs = require("fs");
var dialogPolyfill = require("dialog-polyfill");
const {ipcRenderer} = require('electron');
var glob = require("glob");

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

var appName = appDir.read('package.json', 'json').name;

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('greet').innerHTML = appName;
});
