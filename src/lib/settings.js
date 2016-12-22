/*jshint esversion: 6*/

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4();
}

export class Settings {
  constructor(db) {
    this.db = db;
    db.find({}, function (err, docs) {
      if (docs.length === 0) {
        let data = {
          key: guid(),
          force: 0
        };
        db.insert(data);
      }
    });
  }

  key(callback){
    this.db.find({}, function(err, docs) {
      if (docs.length > 0)
        callback(docs[0].key);
      else
        setTimeout(() => {this.key(callback);}, 1000);
    });
  }

  force(callback){
    this.db.find({}, function(err, docs) {
      if (docs.length > 0)
        callback(docs[0].force);
      else
        setTimeout(() => {this.force(callback);}, 1000);
    });
  }

  incforce(callback){
    this.force((old) => {
      this.db.update({}, { $set: {force: old + 1}}, callback);
    });
  }

  reload() {
    this.db.loadDatabase();
  }
}
