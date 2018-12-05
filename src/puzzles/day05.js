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
        const inverse = Array.from(polimer.map(c => c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()));

        const check = { a: 0, b: 1 };
        while (check.a !== undefined && check.b !== undefined) {
            if (polimer[check.a] === inverse[check.b]) {
                polimer[check.a] = '_';
                polimer[check.b] = '_';
                check.a = this.findNextUnit(polimer, check.a, -1);
                check.b = this.findNextUnit(polimer, check.b, 1);
            } else {
                check.a = undefined;
            }

            if (check.a === undefined) {
                check.a = this.findNextUnit(polimer, check.b - 1, 1);
                check.b = this.findNextUnit(polimer, check.a, 1);
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
