const debug = require('debug')('aoc.fw.runner_child');
const chalk = require('chalk').default;
// eslint-disable-next-line no-unused-vars
const Solution = require('./solution');

async function wrapSolutionAsync(partNumber, func) {
    try {
        const result = func();
        process.send({ part: partNumber, result });
    } catch (err) {
        debug(chalk.bgRedBright(`${err.stack}`));
        debug(chalk.bgRedBright(`Error in part ${partNumber}: ${err}`));
    }
}

async function runSolution(solutionPath, parts) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const SolutionDayXX = require(solutionPath);
    /** @type { Solution } */
    const solution = new SolutionDayXX();
    process.send({ type: 'info', day: solution.day, title: solution.title });

    let lastProgress;
    await solution.init(progress => {
        const now = Date.now();
        if (lastProgress === undefined || now - lastProgress >= 100) {
            lastProgress = now;
            process.send({ type: 'progress', value: progress });
        }
    });

    if (parts.includes(1)) {
        await wrapSolutionAsync(1, () => solution.part1());
    }
    lastProgress = undefined;
    if (parts.includes(2)) {
        await wrapSolutionAsync(2, () => solution.part2());
    }

    process.exit();
}

process.on('message', async message => {
    if (message.solutionPath) {
        await runSolution(message.solutionPath, message.parts);
    }
});
