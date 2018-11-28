// eslint-disable-next-line no-unused-vars
const debug = require('debug')('app.puzzles.day01');
const Solution = require('../fw/solution');

class Day01 extends Solution {
    constructor() {
        super(1, 'Test day 1 name');
    }

    part1() {
        return `${this.name} test 1 result.`;
    }

    part2() {
        return `${this.name} test 2 result.`;
    }
}

module.exports = Day01;
