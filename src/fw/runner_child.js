/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const debug = require('debug')('aoc.fw.runner_child');
const chalk = require('chalk').default;
// eslint-disable-next-line no-unused-vars
const Solution = require('./solution');

async function wrapSolutionAsync(partNumber, frames, func) {
    try {
        const result = func();
        process.send({ part: partNumber, result, frames });
        // eslint-disable-next-line no-param-reassign
        frames.length = 0;
    } catch (err) {
        debug(chalk.bgRedBright(`${err.stack}`));
        debug(chalk.bgRedBright(`Error in part ${partNumber}: ${err}`));
    }
}

async function runSolution(solutionPath, parts) {
    let lastProgress;
    const frames = [];

    const SolutionDayXX = require(solutionPath);
    /** @type { Solution } */
    const solution = new SolutionDayXX();
    process.send({ type: 'info', day: solution.day, title: solution.title });
    solution.on('progress', progress => {
        const now = Date.now();
        if (lastProgress === undefined || now - lastProgress >= 100) {
            lastProgress = now;
            process.send({ type: 'progress', value: progress });
        }
    }).on('frame', lines => {
        frames.push(lines);
    });

    await solution.init();
    if (parts.includes(1)) {
        await wrapSolutionAsync(1, frames, () => solution.part1());
    }
    lastProgress = undefined;
    if (parts.includes(2)) {
        await wrapSolutionAsync(2, frames, () => solution.part2());
    }

    process.exit();
}

process.on('message', async message => {
    if (message.solutionPath) {
        await runSolution(message.solutionPath, message.parts);
    }
});
