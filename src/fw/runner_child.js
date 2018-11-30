// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.fw.runner_child');
// eslint-disable-next-line no-unused-vars
const Solution = require('./solution');

const isDebugMode = false && process.env.DEBUG !== undefined;

function syncWait() {
    for (let i = 0; i < 1000000000; i += 1);
}

async function runSolution(solutionPath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const SolutionDayXX = require(solutionPath);

    // Run solution
    /** @type { Solution } */
    const solution = new SolutionDayXX();
    await solution.init();

    if (isDebugMode) { syncWait(); }
    const part1 = solution.part1();
    process.send({ part: 1, result: part1 });

    if (isDebugMode) { syncWait(); }
    const part2 = solution.part2();
    process.send({ part: 2, result: part2 });

    process.exit();
}

process.on('message', async message => {
    if (message.solutionPath) {
        await runSolution(message.solutionPath);
    }
});
