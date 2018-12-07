const debug = require('debug')('aoc.fw.solution');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;
const { inputDir } = require('./paths');

class Solution {
    /**
     * @param { Number } day The number of the day.
     * @param { String } title The title of the puzzle.
     */
    constructor(day, title) {
        this._day = day;
        this._title = title;
        this._onProgressChanged = undefined;
    }

    /** @type { String } */
    get title() { return this._title; }

    /** @type { Number } */
    get day() { return this._day; }

    /** @type { Array<String> } */
    get input() { return this._input; }

    async init(onProgressChanged = () => { }) {
        this._onProgressChanged = onProgressChanged;
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
        return undefined;
    }

    part2() {
        return undefined;
    }

    /**
     * Announce the current progress.
     * @param { Number } current The current value;
     * @param { Number } max The max value. default = 1.
     * @param { Number } min The min value. default = 0.
     */
    progress(current, max = 1, min = 0) {
        const d = 100 / (max - min);
        // eslint-disable-next-line no-param-reassign
        current = (current - min) * d;
        this._onProgressChanged(current);
    }
}

module.exports = Solution;
