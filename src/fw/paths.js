const debug = require('debug')('aoc.fw.paths');
const path = require('path');
const fs = require('fs-extra');

const root = path.join(__dirname, '..', '..');
const puzzleDir = path.join(root, 'src', 'puzzles');
const inputDir = path.join(root, 'input');

/**
 * Get solution files based on the selected day.
 * undefined => all solution files.
 * number => selected solution file if exists, or last.
 * @param {*} selectedDay
 * @returns { Array<String> } Full paths to the selected solution files.
 */
async function getSolutionFilesAsync(selectedDay) {
    const selectedDayNumber = parseInt(selectedDay, 10);

    // Write available files to console
    const files = await fs.readdir(puzzleDir);

    let selectedFile;
    // If a day is selected, fall back to last file.
    if (selectedDay !== undefined) {
        [selectedFile] = files.slice(-1);
    }

    // Select the file based on the day.
    if (Number.isInteger(selectedDayNumber)) {
        const solutionFileRegex = /day(?:([0-9]{2}))\.js/;
        const tempFile = files.filter(f => parseInt(solutionFileRegex.exec(f)[1], 10) === selectedDayNumber)[0];
        selectedFile = tempFile === undefined ? selectedFile : tempFile;
    }

    let selectedFiles = [selectedFile];
    // If no day is selected, fall back to every file.
    if (selectedFile === undefined) { selectedFiles = files; }

    // Convert files names to full paths.
    selectedFiles = selectedFiles.map(x => path.join(puzzleDir, x));
    debug(`Selected: ${selectedFiles} for ${selectedDayNumber}`);

    return selectedFiles;
}

module.exports = {
    puzzleDir,
    inputDir,
    getSolutionFilesAsync
};
