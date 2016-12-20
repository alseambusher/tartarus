/*jshint esversion: 6*/
//load database
var Datastore = require('nedb');
var tartarusDb = new Datastore({ filename: __dirname + '/db/tartarus.db' });
var filesDb = new Datastore({ filename: __dirname + '/db/files.db' });
var schedulesDb = new Datastore({ filename: __dirname + '/db/schedules.db' });

function settings(key){
  let data = {};
  if (!key) {
    key = "test";
  }
  return data;
}

class Settings {

}

class Files {

}

class Schedules {

}

export function load(){
  tartarusDb.loadDatabase(function (err) {
    if (err) throw err;
  });
  filesDb.loadDatabase(function (err) {
    if (err) throw err;
  });
  schedulesDb.loadDatabase(function (err) {
    if (err) throw err;
  });
}
