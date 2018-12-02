// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day02');
const Solution = require('../fw/solution');

class Day02 extends Solution {
    constructor() { super(2, 'Inventory Management System'); }

    part1() {
        const results = {
            twos: 0,
            threes: 0
        };

        this.input.forEach(label => {
            const map = new Map();
            for (const c of label) {
                if (!map.has(c)) {
                    map.set(c, 0);
                }
                map.set(c, map.get(c) + 1);
            }
            let two = 0; let three = 0;
            for (const [, entry] of map) {
                if (entry === 2) {
                    two = 1;
                } else if (entry === 3) {
                    three = 1;
                }
            }
            results.twos += two;
            results.threes += three;
        });
        return results.twos * results.threes;
    }

    part2() {
        const { length } = this.input;
        let current = [];
        for (let i = 0; i < length; i++) {
            const a = this.input[i];
            for (let j = i + 1; j < length; j++) {
                const b = this.input[j];
                current = this.diff(a, b, current);
            }
            if (current.length === a.length - 1) {
                break;
            }
        }

        return current.join('');
    }

    diff(a, b, current) {
        const length = a.length;
        let result = [];
        for (let i = 0; i < length; i++) {
            if (a[i] === b[i]) {
                result.push(a[i]);
            }
        }

        if (result.length <= current.length) {
            result = current;
        }

        return result;
    }
}

module.exports = Day02;
