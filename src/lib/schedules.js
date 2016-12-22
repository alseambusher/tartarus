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
      locked: false,
      done: false,
      timestamp: new Date().toString()
    };
    return this.db.insert(data);
  }

  files(callback){
    this.db.find({}).sort({ createdAt: -1 }).exec(function (err, docs) {
      callback(docs);
    });
  }

  file(_id, callback) {
    this.db.find({ _id: _id }, function (err, docs) {
      callback(docs[0]);
    });
  }

  done(_id) {
    this.db.update({ _id: _id}, { $set: {done: true}});
  }

  lock(_id) {
    this.db.update({ _id: _id}, { $set: {locked: true}});
  }

  delete(_id, callback) {
    this.db.remove({ _id: _id, done: true}, {}, function (err, numRemoved) {
      if (numRemoved > 0)
        callback();
    });
    this.db.remove({ _id: _id, done: false, locked: false}, {}, function (err, numRemoved) {
      if (numRemoved > 0)
        callback();
    });
  }

  force(_id, callback) {
    let oldDate = new Date();
    oldDate.setYear(1992);
    this.db.update({ _id: _id, done: false, locked: true}, { $set: {unlockTime: oldDate.toString()}}, callback);
  }

  reload() {
    this.db.loadDatabase();
  }

}
