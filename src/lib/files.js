/*jshint esversion: 6*/
import { default as encrypt} from "./encrypt";

export class Files {
  constructor(db) {
    this.db = db;
  }

  add(filename, unlockTime, callback){
    let data = {
      filename: filename,
      unlockTime: unlockTime,
      done: false,
      timestamp: new Date().toString()
    };
    encrypt(filename, this.key, () => {
      callback(this.db.insert(data));
    });
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

  setKey (key) {
    this.key = key;
  }

  delete(_id, callback) {
    this.db.remove({ _id: _id, done: true}, {}, function (err, numRemoved) {
      callback();
    });
  }

  force(_id, callback) {
    let oldDate = new Date();
    oldDate.setYear(1992);
    this.db.update({ _id: _id, done: false}, { $set: {unlockTime: oldDate.toString()}}, callback);
  }

  reload() {
    this.db.loadDatabase();
  }
}
