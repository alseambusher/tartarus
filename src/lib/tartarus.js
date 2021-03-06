/*jshint esversion: 6*/
//load database
import { Files } from "./files";
import { Schedules } from "./schedules";
import { Settings } from "./settings";

var Datastore = require('nedb');

export var settingsDbFile = "/db/settings.db";
export var filesDbFile = "/db/files.db";
export var schedulesDbFile = "/db/schedules.db";

var settingsDb = new Datastore({ filename: __dirname + settingsDbFile, timestampData: true });
var filesDb = new Datastore({ filename: __dirname + filesDbFile, timestampData: true });
var schedulesDb = new Datastore({ filename: __dirname + schedulesDbFile, timestampData: true });

export var files, schedules, settings;

export function load() {
  settingsDb.loadDatabase(function (err) {
    if (err) {
      setTimeout(load, 100);
      return;
    }
  });
  filesDb.loadDatabase(function (err) {
    if (err) {
      setTimeout(load, 100);
      return;
    }
  });
  schedulesDb.loadDatabase(function (err) {
    if (err) {
      setTimeout(load, 100);
      return;
    }
  });
  settings = new Settings(settingsDb);
  schedules = new Schedules(schedulesDb);
  files = new Files(filesDb);
  settings.key((key) => {
    files.setKey(key);
  });
}
