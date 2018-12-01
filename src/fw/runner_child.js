// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.fw.runner_child');
// eslint-disable-next-line no-unused-vars
const Solution = require('./solution');

const isSlowMode = process.env.SLOW !== undefined;

function asyncWait(timeout) {
    return new Promise(resolve => setTimeout(() => resolve, timeout ? 2500 : timeout));
}

async function runSolution(solutionPath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const SolutionDayXX = require(solutionPath);

    // Run solution
    /** @type { Solution } */
    const solution = new SolutionDayXX();
    process.send({ type: 'info', day: solution.day, title: solution.title });
    await solution.init();

    const part1 = solution.part1();
    if (isSlowMode) { await asyncWait(); }
    process.send({ part: 1, result: part1 });

    const part2 = solution.part2();
    if (isSlowMode && part1 !== undefined) { await asyncWait(); }
    process.send({ part: 2, result: part2 });

    process.exit();
}

process.on('message', async message => {
    if (message.solutionPath) {
        await runSolution(message.solutionPath);
    }
});
