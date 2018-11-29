const debug = require('debug')('aoc.fw.solution');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;
const { inputDir } = require('./paths');

class Solution {
    /**
     * @param { Number } day The number of the day.
     * @param { String } name The name of the puzzle.
     */
    constructor(day, name) {
        this._day = day;
        this._name = name;
    }

    /** @type { String } */
    get name() { return this._name; }

    /** @type { Number } */
    get day() { return this._day; }

    /** @type { Array<String> } */
    get input() { return this._input; }

    async init() {
        const dayStr = this.day.toString().padStart(2, '0');
        const inputPath = path.join(inputDir, `day${dayStr}.txt`);
        try {
            const buffer = await fs.readFile(inputPath, { encoding: 'utf-8' });
            const newLineRegex = /\r\n?|\n/g;
            this._input = buffer.toString('utf-8').split(newLineRegex);
        } catch (err) {
            debug(chalk.red(err));
            debug(chalk.redBright(`Input could not be loaded for Day ${this.day}!`));
        }
    }

    part1() {
        return `Day ${this.day} part 1 not implemented.`;
    }

    part2() {
        return `Day ${this.day} part 2 not implemented.`;
    }
}

module.exports = Solution;
