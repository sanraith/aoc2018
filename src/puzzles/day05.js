// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day05');
const Solution = require('../fw/solution');

class Day05 extends Solution {
    constructor() { super(5, 'Alchemical Reduction'); }

    part1() {
        return this.reduce([...this.input[0]]);
    }

    part2() {
        const input = [...this.input[0]];
        let minlength = input.length;
        for (let charCode = 65; charCode < 91; charCode++) {
            this.progress(charCode, 91, 65);
            const charsToRemove = [String.fromCharCode(charCode), String.fromCharCode(charCode + 32)];
            const length = this.reduce(input.filter(x => !charsToRemove.includes(x)));

            if (length < minlength) {
                minlength = length;
            }
        }

        return minlength;
    }

    reduce(input) {
        const polimer = input;
        const inverse = Array.from(polimer.map(c => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())));

        const check = [0, 1];
        while (check[0] !== undefined && check[1] !== undefined) {
            if (polimer[check[0]] === inverse[check[1]]) {
                polimer[check[0]] = '_';
                polimer[check[1]] = '_';
                check[0] = this.findNextUnit(polimer, check[0], -1);
                check[1] = this.findNextUnit(polimer, check[1], 1);
            } else {
                check[0] = undefined;
            }

            if (check[0] === undefined) {
                check[0] = this.findNextUnit(polimer, check[1] - 1, 1);
                check[1] = this.findNextUnit(polimer, check[0], 1);
            }
        }

        return polimer.filter(x => x !== '_').join('').length;
    }

    findNextUnit(polimer, start, direction) {
        let pos = start + direction;
        while (pos >= 0 && pos < polimer.length && polimer[pos] === '_') {
            pos += direction;
        }
        if (pos < 0 || pos >= polimer.length) {
            return undefined;
        }

        return pos;
    }
}

module.exports = Day05;
