// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc');
const runner = require('./src/fw/runner');

/** @type { Array } */
const args = process.argv.slice(2);

process.stdout.write('\x1Bc'); // Clear console
if (args.length > 0) {
    runner.run(args[0]);
} else {
    runner.run();
}
