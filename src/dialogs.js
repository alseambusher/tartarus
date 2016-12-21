/*jshint esversion: 6 */
import { get_current_content } from "./instance";
import * as tartarus from "./lib/tartarus";
var dialogPolyfill = require("dialog-polyfill");

export default function() {
  var init = function() {
    document.querySelectorAll("dialog").forEach((element) => {
      dialogPolyfill.registerDialog(element);
    });

    document.querySelectorAll("#button_add").forEach((element) => {
      element.onclick = () => {
        document.getElementById("dialog_add_" + get_current_content()).showModal();
        let now = new Date();
        document.querySelectorAll("#dialog_add_" + get_current_content() + " input[type='date']").forEach((element) => {
          element.value = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
        });
        let timeDOM = document.querySelectorAll("#dialog_add_" + get_current_content() + " input[type='time']");
        timeDOM[0].value = now.toTimeString().split(" ")[0];
        if (timeDOM.length > 1){
          let end = new Date();
          end.setHours(end.getHours() + 1);
          timeDOM[1].value = end.toTimeString().split(" ")[0];
        }
      };
    });

    document.getElementById("button_add_Files_ok").onclick = () => {
      let filenames = document.querySelector("#dialog_add_Files input[type='file']").files;
      let date = document.querySelector("#dialog_add_Files input[type='date']").value;
      let time = document.querySelector("#dialog_add_Files input[type='time']").value;
      let unlockTime = new Date(date + " " + time).toString();
      if (filenames.length > 0 && unlockTime){
        for (let i=0; i<filenames.length; i++){
          tartarus.files.add(filenames[i].path, unlockTime);
        }
        tartarus.files.ui_update();
        document.getElementById("dialog_add_" + get_current_content()).close();
      }
    };

    document.getElementById("button_add_Schedules_ok").onclick = () => {
      let filename = document.querySelector("#dialog_add_Schedules input[type='file']").value;
      let dates = document.querySelectorAll("#dialog_add_Schedules input[type='date']");
      let times = document.querySelectorAll("#dialog_add_Schedules input[type='time']");
      let lockTime = new Date(dates[0].value + " " + times[0].value).toString();
      let unlockTime = new Date(dates[1].value + " " + times[1].value).toString();
      if (filename && unlockTime && lockTime){
        tartarus.schedules.add(filename, lockTime, unlockTime);
        tartarus.schedules.ui_update();
      }
      // TODO close modal
    };

  };

  init();
}
