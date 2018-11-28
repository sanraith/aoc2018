// eslint-disable-next-line no-unused-vars
const debug = require('debug')('app.puzzles.day01');
const Solution = require('../fw/solution');

class Day01 extends Solution {
    constructor() {
        super('Test day 1 name');
    }

    part1() {
        return `${this.name} test result.`;
    }
}

module.exports = Day01;
