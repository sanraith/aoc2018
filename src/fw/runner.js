/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const debug = require('debug')('aoc.fw.runner');
const path = require('path');
const fs = require('fs-extra');
const { Spinner } = require('clui');
const Stopwatch = require('statman-stopwatch');
const { fork } = require('child_process');
const { puzzleDir } = require('./paths');

function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000), 10);
    let seconds = parseInt((duration / 1000) % 60, 10);
    let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

    milliseconds = milliseconds.toString().padStart(3, '0');
    [hours, minutes, seconds] = [hours, minutes, seconds].map(x => x.toString().padStart(2, '0'));

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

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

async function runChildAsync(fileToImport, stopwatch) {
    const countdown = new Spinner('Thinking...  ', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    let progress;

    const countDownIntervalId = setInterval(() => {
        if (progress) {
            const progressStr = (parseInt(progress * 100, 10) / 100).toFixed(2).toString().padStart(6, ' ');
            countdown.message(`Thinking... ${msToTime(stopwatch.read())} ${progressStr}%`);
        } else {
            countdown.message(`Thinking... ${msToTime(stopwatch.read())}`);
        }
    }, 100);

    const child = fork(path.resolve(__dirname, 'runner_child.js'));
    let childClosedPromiseResolver;
    // eslint-disable-next-line no-return-assign
    const childClosedPromise = new Promise(res => (childClosedPromiseResolver = res));

    child.on('message', msg => {
        if (msg.type === 'info') {
            console.log(`Day ${msg.day} - ${msg.title}`);
            countdown.start();
        } else if (msg.type === 'progress') {
            // console.log(msg.value);
            progress = msg.value;
        } else if (msg.result !== undefined) {
            countdown.stop();
            // TODO replace with more sophisticated UI.
            console.log(` - Part ${msg.part}: ${msg.result}`);
            progress = undefined;
            countdown.start();
        }
    }).on('close', () => {
        countdown.stop();
        childClosedPromiseResolver();
    });
    child.send({ solutionPath: fileToImport });

    await childClosedPromise;
    clearInterval(countDownIntervalId);
}

async function runAsync(selectedDay) {
    const filesToRun = await getSolutionFilesAsync(selectedDay);
    const stopwatch = new Stopwatch(true);

    for (const fileToRun of filesToRun) {
        await runChildAsync(fileToRun, stopwatch);
    }

    const elapsed = stopwatch.stop();
    console.log(`Done. Elapsed: ${msToTime(elapsed)}`);
}

module.exports = {
    runAsync
};
