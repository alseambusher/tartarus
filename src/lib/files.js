/*jshint esversion: 6*/
import { default as encrypt} from "./encrypt";

export class Files {
  constructor(db, key) {
    this.db = db;
    this.key = key;
  }

  add(filename, unlockTime){
    let data = {
      filename: filename,
      unlockTime: unlockTime,
      done: false,
      timestamp: new Date().toString()
    };
    encrypt(filename, key, () => {
      return this.db.insert(data);
    });
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

  done(_id) {
    this.db.update({ _id: _id}, {done: true});
  }
}
