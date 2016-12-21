import * as tartarus from "./lib/tartarus";

function run() {
  tartarus.files.files(console.log);
  tartarus.load();
  setTimeout(run, 30000);
}

tartarus.load ();
setTimeout(run, 30000);
