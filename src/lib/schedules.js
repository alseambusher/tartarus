/*jshint esversion: 6*/

export class Schedules {
  constructor(db) {
    this.db = db;
  }

  add(filename, lockTime, unlockTime){
    let data = {
      filename: filename,
      lockTime: lockTime,
      unlockTime: unlockTime,
      timestamp: new Date().toString()
    };
    return this.db.insert(data);
  }

  files(callback){
    this.db.find({}, function (err, docs) {
      callback(docs);
    });
  }

  file(_id, callback) {
    this.db.find({ _id: _id }, function (err, docs) {
      callback(docs[0]);
    });
  }

  reload() {
    this.db.loadDatabase();
  }

}
