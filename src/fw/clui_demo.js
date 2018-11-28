/* eslint-disable */
var os = require('os'),
    clui = require('clui');
 
var Gauge = clui.Gauge;
 
var total = os.totalmem();
var free = os.freemem();
var used = total - free;
var human = Math.ceil(used / 1000000) + ' MB';
 
console.log(Gauge(used, total, 20, total * 0.8, human));

//--------------------------------------------------------

var CLI = require('clui'),
    Spinner = CLI.Spinner;
 
var countdown = new Spinner('Exiting in 10 seconds...  ', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
 
countdown.start();
 
var number = 10;
setInterval(function () {
  number--;
  countdown.message('Exiting in ' + number + ' seconds...  ');
  if (number === 0) {
    process.stdout.write('\n');
    process.exit(0);
  }
}, 1000);