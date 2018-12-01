// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day01');
const Solution = require('../fw/solution');

class Day01 extends Solution {
    constructor() {
        super(1, 'Chronal Calibration');
    }

    part1() {
        let sum = 0;
        this.input.forEach(x => {
            sum += parseInt(x, 10);
        });

        return sum;
    }

    part2() {
        const freqs = new Set([]);
        let duplicate;
        let sum = 0;

        do {
            for (let i = 0; i < this.input.length; i += 1) {
                sum += parseInt(this.input[i], 10);
                if (freqs.has(sum)) {
                    duplicate = sum;
                    break;
                }
                freqs.add(sum);
            }
        } while (duplicate === undefined);

        return duplicate;
    }
}

module.exports = Day01;
