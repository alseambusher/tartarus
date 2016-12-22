/*jshint esversion: 6 */
import * as tartarus from "./lib/tartarus";
import {default as crypt} from "./lib/encrypt";

var processing = [];
var s_processing = [];

function run() {
  console.log("processsing", processing);
  console.log("s_processsing", s_processing);

  tartarus.files.files((files) => {
    files.forEach((file) => {
      if (!file.done && (new Date(file.unlockTime).getTime() <= new Date().getTime())){
        if (processing.indexOf(file._id) <= -1){
          processing.push(file._id);
          console.log("decrypting " + file.filename);
          tartarus.settings.key((password) => {
            // decrypt
            crypt(file.filename, password, () => {
              var index = processing.indexOf(file._id);
              if (index > -1) {
                processing.splice(index, 1);
              }
              tartarus.files.done(file._id);
              console.log("decrypted " + file.filename);
            }, true);
          });
        }
      }
    });
  });

  tartarus.schedules.files((files) => {
    files.forEach((file) => {
      // if not done and past lock time
      if(!file.done && (new Date(file.lockTime).getTime() <= new Date().getTime())) {
        // if it is not locked then encrypt it and lock it
        if(!file.locked){
          if (s_processing.indexOf(file._id) <= -1) {
            s_processing.push(file._id);
            console.log("encrypting " + file.filename);
            tartarus.settings.key((password) => {
              // encrypt
              crypt(file.filename, password, () => {
                var index = s_processing.indexOf(file._id);
                if (index > -1) {
                  s_processing.splice(index, 1);
                }
                tartarus.schedules.lock(file._id);
                console.log("encrypted " + file.filename);
              }, false);
            });
          }
        }
        // if file is locked then unlock it if it is past unlock time and mark done
        else if ((new Date(file.unlockTime).getTime() <= new Date().getTime())) {
          if (s_processing.indexOf(file._id) <= -1) {
            s_processing.push(file._id);
            console.log("decrypting " + file.filename);
            tartarus.settings.key((password) => {
              // decrypt
              crypt(file.filename, password, () => {
                var index = s_processing.indexOf(file._id);
                if (index > -1) {
                  s_processing.splice(index, 1);
                }
                tartarus.schedules.done(file._id);
                console.log("decrypting " + file.filename);
              }, true);
            });
          }
        }
      }
    });
  });
  tartarus.load();
  setTimeout(run, 5000);
}

tartarus.load ();
setTimeout(run, 5000);
