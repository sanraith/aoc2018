const debug = require('debug')('aoc.fw.solution');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;
const EventEmitter = require('events');
const { inputDir } = require('./paths');

class Solution extends EventEmitter {
    /**
     * @param { Number } day The number of the day.
     * @param { String } title The title of the puzzle.
     */
    constructor(day, title) {
        super();
        this._day = day;
        this._title = title;
        this._onProgressChanged = undefined;

        /** @type { {width: number, height: number} } */
        this.canvas = { width: 0, height: 0 };
    }

    /** @type { String } */
    get title() { return this._title; }

    /** @type { Number } */
    get day() { return this._day; }

    /** @type { Array<String> } */
    get input() { return this._input; }

    get visualizationOn() { return this.listeners('frame').length > 0; }

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
        return undefined;
    }

    part2() {
        return undefined;
    }

    /**
     * Send an animation frame to be visualized.
     * @param { Array<string> } lines
     */
    frame(lines) {
        this.emit('frame', lines);
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
        this.emit('progress', current);
    }
}

module.exports = Solution;
