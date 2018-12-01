// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc');
const path = require('path');
const runner = require('./src/fw/runner');

process.stdout.write('\x1Bc'); // Clear console

/** @type { Array } */
const appPos = process.argv.map(x => path.basename(x)).indexOf(path.basename(__filename));
let selectedDay;
if (appPos > -1) {
    selectedDay = process.argv[appPos + 1];
}

runner.runAsync(selectedDay);
