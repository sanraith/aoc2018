const debug = require('debug')('aoc.fw.runner');
const path = require('path');
const fs = require('fs');

// eslint-disable-next-line no-unused-vars
const Solution = require('./solution');
const { puzzleDir } = require('./paths');

async function run(selectedDay) {
    const files = fs.readdirSync(puzzleDir);

    // Write available files to console
    debug(`Files in ${puzzleDir}:`);
    files.forEach(fileName => debug(`- ${fileName}`));

    // Import solution class from the last file
    let [selectedFile] = files.slice(-1);
    if (Number.isInteger(parseInt(selectedDay, 10))) {
        const regex = /day(?:([0-9]{2}))\.js/;
        const tempFile = files.filter(x => parseInt(regex.exec(x)[1], 10) === selectedDay)[0];
        selectedFile = tempFile !== undefined ? tempFile : selectedFile;
    }

    debug(`Selected: ${selectedFile}`);
    const fileToImport = path.join(puzzleDir, selectedFile);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const SolutionImplementation = require(fileToImport);

    // Run solution
    /** @type { Solution } */
    const solution = new SolutionImplementation();
    await solution.init();
    debug(`Part 1: ${solution.part1()}`);
    debug(`Part 2: ${solution.part2()}`);
}

module.exports = {
    run
};
