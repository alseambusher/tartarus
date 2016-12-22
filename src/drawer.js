/*jshint esversion: 6 */
import env from './env';
import { set_current_content } from "./instance";

export var items = {
  Files: {
    icon: "folder"
  },
  Schedules: {
    icon: "query_builder"
  },
  // Settings: {
  //   icon: "settings"
  // },
  Github: {
    icon: "code",
    onclick: () => {
      let shell = require('electron').shell;
      shell.openExternal(env.githubURL);
    }
  }
};

export default function(container) {
  var init = function(){
    let innerHTML = "<span class='mdl-layout-title'>"+ env.appname +"</span>";
    innerHTML += "<nav class='mdl-navigation'>";
    Object.keys(items).forEach ((title) => {
      innerHTML += "<a class='mdl-navigation__link'><div class='material-icons'>"+ items[title].icon +"</div> "+ title +"</a>";
    });
    innerHTML += "</nav>";
    container.innerHTML = innerHTML;
    container.querySelectorAll("a").forEach((itemDOM, i) => {
      if (items[Object.keys(items)[i]].onclick) {
        itemDOM.onclick = items[Object.keys(items)[i]].onclick;
      } else {
        itemDOM.onclick = () => {
          document.querySelector(".mdl-layout__header .mdl-layout-title").innerHTML = Object.keys(items)[i];
          set_current_content(Object.keys(items)[i]);
          document.querySelectorAll(".content").forEach((node) => {
            node.style.display = "none";
          });
          document.getElementById("content_" + Object.keys(items)[i]).style.display = "inline";
        };
      }
    });
  };

  init();
}
