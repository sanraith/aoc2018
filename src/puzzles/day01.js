// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day01');
const Solution = require('../fw/solution');

class Day01 extends Solution {
    constructor() {
        super(1, 'Test day 1 name');
    }

    part1() {
        return this.input;
    }

    part2() {
        return `${this.name} test 2 result.`;
    }
}

module.exports = Day01;
