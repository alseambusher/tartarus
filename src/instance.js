/*jshint esversion: 6 */
import * as tartarus from "./lib/tartarus";

export var current_content = "";
export function get_current_content(){
  return current_content;
}
export function set_current_content(value){
  tartarus.load();
  current_content = value;
}
