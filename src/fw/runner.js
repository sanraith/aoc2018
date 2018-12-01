/* eslint-disable no-console */
const debug = require('debug')('aoc.fw.runner');
const path = require('path');
const fs = require('fs-extra');
const { Spinner } = require('clui');
const Stopwatch = require('statman-stopwatch');
const { fork } = require('child_process');
const { puzzleDir } = require('./paths');

async function getSolutionFileAsync(selectedDay) {
    const selectedDayNumber = parseInt(selectedDay, 10);

    // Write available files to console
    const files = await fs.readdir(puzzleDir);
    debug(`Files in ${puzzleDir}:`);
    files.forEach(fileName => debug(`- ${fileName}`));

    // Import solution class from the last file
    let selectedFile = files.slice(-1)[0];
    if (Number.isInteger(selectedDayNumber)) {
        const solutionFileRegex = /day(?:([0-9]{2}))\.js/;
        const tempFile = files.filter(f => parseInt(solutionFileRegex.exec(f)[1], 10) === selectedDayNumber)[0];
        selectedFile = tempFile !== undefined ? tempFile : selectedFile;
    }
    debug(`Selected: ${selectedFile} for ${selectedDayNumber}`);
    const fileToImport = path.join(puzzleDir, selectedFile);

    return fileToImport;
}

function msToTime(duration) {
    const milliseconds = parseInt((duration % 1000), 10);
    let seconds = parseInt((duration / 1000) % 60, 10);
    let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

async function runAsync(selectedDay) {
    const stopwatch = new Stopwatch(true);
    const countdown = new Spinner('Thinking...  ', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    let countDownIntervalId = -1;
    const fileToImport = await getSolutionFileAsync(selectedDay);

    const child = fork(path.resolve(__dirname, 'runner_child.js'));
    child.on('message', msg => {
        if (msg.type === 'info') {
            console.log(`Day ${msg.day} - ${msg.title}`);
            countdown.start();
        } else if (msg.result !== undefined) {
            countdown.stop();
            // TODO replace with more sophisticated UI.
            console.log(`Part ${msg.part}: ${msg.result}`);
            countdown.start();
        }
    }).on('close', () => {
        clearInterval(countDownIntervalId);
        countdown.stop();
        const elapsed = stopwatch.stop();
        console.log(`Elapsed: ${msToTime(elapsed)}`);
    });
    countDownIntervalId = setInterval(() => {
        countdown.message(`Thinking... ${msToTime(stopwatch.read())}`);
    }, 100);

    child.send({ solutionPath: fileToImport });
}

module.exports = {
    runAsync
};
