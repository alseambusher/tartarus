Tartarus
========

Tartarus (/ˈtɑːrtərəs/) - named after a prison for bad guys in Greek mythology, is an electron app using which we can lock away games, movies or any files to fight your addiction and increase productivity.

![basic](http://i.imgur.com/3lFeiSJ.png)

You can use this in two ways.

1. You can lock now and set the time at which it has to be unlocked.
2. You can schedule locking and unlocking.

![schedules](http://i.imgur.com/TzM9yFD.png)

##Setup - Installer
Install node and then [download](https://github.com/alseambusher/tartarus/releases) binary.  
(NOTE: Sometimes it might not work the first time you open. Restart app)

##Setup - Code (dev mode)

Install node and then

```bash
git clone https://github.com/alseambusher/tartarus
cd tartarus
npm install
npm start
```

##Force open
You can force open locked content at the expense of increase in "force open count" badge :P

![force](http://i.imgur.com/4s6EKJT.png)

##Compatibility
This should be compatible with Linux, Windows and MacOS. However, I have only tested in linux.

###Todo
1. Find alternative to `pm2` to run `tartarus-process.js`. Or find a way to package `pm2` using `electron-packager` so that user wont need node.
2. Add auto refresh for datatables without `fs.watch`.
3. Design a cool icon (`.icon`, `.icns` and `.ico`).

