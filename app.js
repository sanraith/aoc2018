// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc');
const path = require('path');
const runner = require('./src/fw/runner');

process.stdout.write('\x1Bc'); // Clear console

/** @type { Array } */
const appPos = process.argv.map(x => path.basename(x)).indexOf(path.basename(__filename));
let selectedDay;
let parts = [1, 2];
if (appPos > -1) {
    const args = process.argv.slice(appPos + 1);
    selectedDay = args[0];
    if (args[1] !== undefined) {
        parts = [parseInt(args[1], 10)];
    }
}

runner.runAsync(selectedDay, parts);
