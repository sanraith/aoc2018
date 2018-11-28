const debug = require('debug')('aoc.fw.solution');
const fs = require('fs');
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
    get name() {
        return this._name;
    }

    /** @type { Number } */
    get day() {
        return this._day;
    }

    /** @type { String } */
    get input() {
        return this._input;
    }

    init() {
        const dayStr = this.day.toString().padStart(2, '0');
        const inputPath = path.join(inputDir, `day${dayStr}.txt`);
        if (fs.existsSync(inputPath)) {
            this._input = fs.readFileSync(inputPath).toString('utf-8');
        } else {
            debug(chalk.red(`Input not found for day ${this.day}! ${inputPath}`));
        }
    }

    // eslint-disable-next-line class-methods-use-this
    part1() {
        return 'Not implemented.';
    }

    // eslint-disable-next-line class-methods-use-this
    part2() {
        return 'Not implemented.';
    }
}

module.exports = Solution;
