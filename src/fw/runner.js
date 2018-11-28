// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.fw.runner');
const path = require('path');
const fs = require('fs');

const puzzlePath = path.join(__dirname, '..', 'puzzles');
const files = fs.readdirSync(puzzlePath);

// Write available files to console
debug(`Files in ${puzzlePath}:`);
files.forEach(fileName => debug(`- ${fileName}`));

// Import solution class from the last file
const [selectedFile] = files.slice(-1);
debug(`Selected: ${selectedFile}`);
const fileToImport = path.join(puzzlePath, selectedFile);
// eslint-disable-next-line import/no-dynamic-require
const SolutionImplementation = require(fileToImport);

// Run solution
const solution = new SolutionImplementation();
debug(`Part 1: ${solution.part1()}`);
debug(`Part 2: ${solution.part2()}`);
