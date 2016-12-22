/*jshint esversion: 6 */
import * as tartarus from "./lib/tartarus";
import {default as decrypt} from "./lib/encrypt";

var processing = [];

function run() {
  tartarus.files.files((files) => {
    files.forEach((file) => {
      if (!file.done && (new Date(file.unlockTime).getTime() <= new Date().getTime())){
        if (processing.indexOf(file._id) <= -1){
          processing.push(file._id);
          console.log("decrypting " + file.filename);
          tartarus.settings.key((password) => {
            decrypt(file.filename, password, () => {
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
  tartarus.load();
  setTimeout(run, 30000);
}

tartarus.load ();
setTimeout(run, 30000);
