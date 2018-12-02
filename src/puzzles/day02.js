// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day02');
const Solution = require('../fw/solution');

class Day02 extends Solution {
    constructor() { super(2, 'Inventory Management System'); }

    part1() {
        const results = { twos: 0, threes: 0 };

        for (const label of this.input) {
            const map = new Map();
            for (const c of label) {
                if (!map.has(c)) { map.set(c, 0); }
                map.set(c, map.get(c) + 1);
            }

            const values = Array.from(map.values());
            results.twos += values.some(v => v === 2) ? 1 : 0;
            results.threes += values.some(v => v === 3) ? 1 : 0;
        }

        return results.twos * results.threes;
    }

    part2() {
        const count = this.input.length;
        let current = [];
        for (let i = 0; i < count; i++) {
            const a = this.input[i];
            for (let j = i + 1; j < count; j++) {
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
