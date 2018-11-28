const debug = require('debug')('aoc.fw.runner');
const path = require('path');
const fs = require('fs-extra');

// eslint-disable-next-line no-unused-vars
const Solution = require('./solution');
const { puzzleDir } = require('./paths');

async function run(selectedDay) {
    const files = await fs.readdir(puzzleDir);

    // Write available files to console
    debug(`Files in ${puzzleDir}:`);
    files.forEach(fileName => debug(`- ${fileName}`));

    // Import solution class from the last file
    let selectedFile = files.slice(-1)[0];
    if (Number.isInteger(parseInt(selectedDay, 10))) {
        const regex = /day(?:([0-9]{2}))\.js/;
        const tempFile = files.filter(f => parseInt(regex.exec(f)[1], 10) === selectedDay)[0];
        selectedFile = tempFile !== undefined ? tempFile : selectedFile;
    }

    debug(`Selected: ${selectedFile}`);
    const fileToImport = path.join(puzzleDir, selectedFile);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const SolutionDayXX = require(fileToImport);

    // Run solution
    /** @type { Solution } */
    const solution = new SolutionDayXX();
    await solution.init();
    debug(`Part 1: ${solution.part1()}`);
    debug(`Part 2: ${solution.part2()}`);
}

module.exports = {
    run
};
