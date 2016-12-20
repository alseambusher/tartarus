/*jshint esversion: 6 */
import { get_current_content } from "./instance";
var dialogPolyfill = require("dialog-polyfill");

export default function() {
  var init = function() {
    document.querySelectorAll("dialog").forEach((element) => {
      dialogPolyfill.registerDialog(element);
    });

    document.querySelectorAll("#button_add").forEach((element) => {
      element.onclick = () => {
        document.getElementById("dialog_add_" + get_current_content()).showModal();
      };
    });
  };

  init();
}
