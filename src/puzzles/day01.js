// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day01');
const Solution = require('../fw/solution');

class Day01 extends Solution {
    constructor() { super(1, 'Chronal Calibration'); }

    part1() {
        return this.input.reduce((sum, x) => sum + parseInt(x, 10), 0);
    }

    part2() {
        const changes = this.input.map(x => parseInt(x, 10));
        const freqs = new Set();
        let duplicate;
        let freq = 0;

        while (duplicate === undefined) {
            for (const change of changes) {
                freq += change;
                if (freqs.has(freq)) {
                    duplicate = freq;
                    break;
                }
                freqs.add(freq);
            }
        }

        return duplicate;
    }
}

module.exports = Day01;
