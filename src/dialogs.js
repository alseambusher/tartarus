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
          element.value = now.getFullYear() + "-" + (parseInt(now.getMonth()) + 1) + "-" + now.getDate();
        });
        let timeDOM = document.querySelectorAll("#dialog_add_" + get_current_content() + " input[type='time']");
        timeDOM[0].value = now.toTimeString().split(" ")[0];
        if (timeDOM.length > 1){
          let end = new Date();
          end.setMinutes(end.getMinutes() + 30);
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
          tartarus.files.add(filenames[i].path, unlockTime, tartarus.files.ui_update);
        }
        tartarus.files.ui_update();
        document.getElementById("dialog_add_" + get_current_content()).close();
      }
    };

    document.getElementById("button_add_Schedules_ok").onclick = () => {
      let filenames = document.querySelector("#dialog_add_Schedules input[type='file']").files;
      let dates = document.querySelectorAll("#dialog_add_Schedules input[type='date']");
      let times = document.querySelectorAll("#dialog_add_Schedules input[type='time']");
      let lockTime = new Date(dates[0].value + " " + times[0].value).toString();
      let unlockTime = new Date(dates[1].value + " " + times[1].value).toString();
      if (filenames.length > 0 && lockTime && unlockTime){
        for (let i=0; i<filenames.length; i++){
          tartarus.schedules.add(filenames[i].path, lockTime, unlockTime);
        }
        tartarus.schedules.ui_update();
        document.getElementById("dialog_add_" + get_current_content()).close();
      }
    };

    // delete
    document.querySelectorAll("#button_delete").forEach((button) => {
      button.onclick = () => {
        document.getElementById("dialog_delete").showModal();
      };
    });

    document.getElementById("button_delete_ok").onclick = () => {
      let tbody = document.querySelector('#content_'+ get_current_content() +' table tbody');
      let ids = [];
      tbody.querySelectorAll(".mdl-data-table__select input").forEach((checkbox) => {
        if (checkbox.checked)
          tartarus[get_current_content().toLowerCase()].delete(checkbox.id.split("-")[1], tartarus[get_current_content().toLowerCase()].ui_update);
      });
      tartarus[get_current_content().toLowerCase()].ui_update();
      document.getElementById("dialog_delete").close();
    };

    // force
    document.querySelectorAll("#button_force").forEach((button) => {
      button.onclick = () => {
        document.getElementById("dialog_force").showModal();
      };
    });

    document.getElementById("button_force_ok").onclick = () => {
      let tbody = document.querySelector('#content_'+ get_current_content() +' table tbody');
      let ids = [];
      tbody.querySelectorAll(".mdl-data-table__select input").forEach((checkbox) => {
        if (checkbox.checked)
          tartarus[get_current_content().toLowerCase()].force(checkbox.id.split("-")[1], () => {
            tartarus.settings.incforce(() => {});
          });
      });
      tartarus[get_current_content().toLowerCase()].ui_update();
      setTimeout(tartarus[get_current_content().toLowerCase()].ui_update, 1000);
      setTimeout(() => {
        tartarus.settings.force((count) => {
          document.getElementById("force_count_badge").setAttribute("data-badge", count);
        });
      }, 1000);
      document.getElementById("dialog_force").close();
    };

  };

  init();
}
