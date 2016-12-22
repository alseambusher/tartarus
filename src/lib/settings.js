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
          key: guid()
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
}
