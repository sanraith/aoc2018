/* eslint-disable no-await-in-loop */
const debug = require('debug')('aoc.fw.runner');
const path = require('path');
const { Progress, Spinner } = require('clui');
const Stopwatch = require('statman-stopwatch');
const { fork } = require('child_process');
const chalk = require('chalk').default;
const { animate } = require('./animator');
const { getSolutionFilesAsync } = require('./paths');
const Screen = require('./screen');

const debugParams = process.env.DEBUGGER ? { execArgv: ['--inspect=0'] } : undefined;
const screen = new Screen(true);

function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000), 10);
    let seconds = parseInt((duration / 1000) % 60, 10);
    let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

    milliseconds = milliseconds.toString().padStart(3, '0');
    [hours, minutes, seconds] = [hours, minutes, seconds].map(x => x.toString().padStart(2, '0'));

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

async function runChildAsync(fileToImport, parts, stopwatch) {
    const countdown = new Spinner('Thinking...  ', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    const progressBar = new Progress(30);
    let progress;
    const countDownIntervalId = setInterval(() => {
        if (progress) {
            const progressStr = progressBar.update(progress / 100);
            countdown.message(`Thinking... ${msToTime(stopwatch.read())}  ${chalk.white(progressStr)} `);
        } else {
            countdown.message(`Thinking... ${msToTime(stopwatch.read())}`);
        }
    }, 100);

    const child = fork(path.resolve(__dirname, 'runner_child.js'), debugParams);
    let childClosedPromiseResolver;
    // eslint-disable-next-line no-return-assign
    const childClosedPromise = new Promise(res => (childClosedPromiseResolver = res));

    const animations = [];
    child.on('message', async msg => {
        if (msg.type === 'info') {
            screen.addHeader(`Day ${msg.day} - ${msg.title}`);
            countdown.start();
        } else if (msg.type === 'progress') {
            progress = msg.value;
        } else if (msg.result !== undefined) {
            countdown.stop();
            screen.addHeader(` - Part ${msg.part}: ${msg.result}`);
            animations.push(msg.frames);
            progress = undefined;
            countdown.start();
        }
    }).on('close', () => {
        countdown.stop();
        childClosedPromiseResolver();
    });
    child.send({ solutionPath: fileToImport, parts });

    await childClosedPromise;
    clearInterval(countDownIntervalId);

    for (const animation of animations) {
        await animate(screen, animation);
    }
}

async function runAsync(selectedDay, parts) {
    const filesToRun = await getSolutionFilesAsync(selectedDay);
    const stopwatch = new Stopwatch(true);

    for (const fileToRun of filesToRun) {
        if (debugParams !== undefined) {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const solution = new (require(fileToRun))();
            await solution.init();
            debug(`[DEBUGGER] Day ${solution.day} ${solution.title}`);
            if (parts.includes(1)) { debug(`Part 1: ${solution.part1()}`); }
            if (parts.includes(2)) { debug(`Part 2: ${solution.part2()}`); }
        } else {
            await runChildAsync(fileToRun, parts, stopwatch);
        }
    }

    const elapsed = stopwatch.stop();
    console.log(`Done. Elapsed: ${msToTime(elapsed)}`);
}

module.exports = {
    runAsync
};
