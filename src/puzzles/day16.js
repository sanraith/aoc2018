/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day16');
const Solution = require('../fw/solution');

class Day16 extends Solution {
    constructor() { super(16, 'Chronal Classification'); }

    part1() {
        return this.getOpMap().threeOrMoreCount;
    }

    part2() {
        const ops = this.getOps();
        const { map: opNameMap } = this.getOpMap();
        const { program } = this.parseInput();
        const r = [0, 0, 0, 0];
        for (const line of program) {
            const opCode = line[0];
            const params = line.slice(1);
            const opName = opNameMap.get(opCode);
            const op = ops.get(opName);
            op(r, ...params);
        }

        return r[0];
    }

    getOpMap() {
        const ops = this.getOps();
        const { testData } = this.parseInput();
        /** @type { Map<string, Set<number>> } */
        const rmap = new Map([...ops.keys()].map(n => [n, new Set([...Array(16)].map((_, i) => i))]));
        let threeOrMoreCount = 0;

        for (const record of testData) {
            let validCount = 0;
            for (const [name, op] of ops.entries()) {
                const r = record.before.slice();
                op(r, ...record.instruction.slice(1));
                const isValid = record.after.reduce((acc, x, i) => acc && x === r[i], true);
                validCount += isValid;
                if (!isValid) { rmap.get(name).delete(record.instruction[0]); }
            }
            threeOrMoreCount += validCount >= 3;
        }
        const map = this.backtrack(rmap);

        return { map, threeOrMoreCount };
    }

    /** @param { Map<string, Set<number>>} rmap
     * @param { Array<string>} names
     * @param { Map<number, string>} map
     * @return { Map<number, string> }
     */
    backtrack(rmap, names = undefined, map = undefined) {
        names = names || [...rmap.keys()];
        map = map || new Map();

        if (names.length === 0) {
            return map;
        }

        const name = names[0];
        for (const code of rmap.get(name)) {
            if (map.has(code)) { continue; }
            map.set(code, name);
            const result = this.backtrack(rmap, names.slice(1), map);
            if (result) { return result; }
            map.delete(code);
        }

        return null;
    }

    parseInput() {
        const testData = [];
        let row = 0;
        const pattern = /(?:[^0-9]*)?([0-9]+).*?([0-9]+).*?([0-9]+).*?([0-9]+)/;
        while (this.input[row] !== '') {
            const [, ...before] = pattern.exec(this.input[row++]).map(Number);
            const [, ...instruction] = pattern.exec(this.input[row++]).map(Number);
            const [, ...after] = pattern.exec(this.input[row++]).map(Number);
            testData.push({ before, instruction, after });
            row++;
        }

        const program = [];
        while (row < this.input.length) {
            if (this.input[row] !== '') {
                const [, ...instruction] = pattern.exec(this.input[row]).map(Number);
                program.push(instruction);
            }
            row++;
        }

        return { testData, program };
    }

    getOps() {
        const ops = new Map([
            ['addr', (r, a, b, c) => r[c] = r[a] + r[b]],
            ['addi', (r, a, b, c) => r[c] = r[a] + b],

            ['mulr', (r, a, b, c) => r[c] = r[a] * r[b]],
            ['muli', (r, a, b, c) => r[c] = r[a] * b],

            ['banr', (r, a, b, c) => r[c] = r[a] & r[b]],
            ['bani', (r, a, b, c) => r[c] = r[a] & b],

            ['borr', (r, a, b, c) => r[c] = r[a] | r[b]],
            ['bori', (r, a, b, c) => r[c] = r[a] | b],

            ['setr', (r, a, b, c) => r[c] = r[a]],
            ['seti', (r, a, b, c) => r[c] = a],

            ['gtir', (r, a, b, c) => r[c] = a > r[b] ? 1 : 0],
            ['gtri', (r, a, b, c) => r[c] = r[a] > b ? 1 : 0],
            ['gtrr', (r, a, b, c) => r[c] = r[a] > r[b] ? 1 : 0],

            ['eqir', (r, a, b, c) => r[c] = a === r[b] ? 1 : 0],
            ['eqri', (r, a, b, c) => r[c] = r[a] === b ? 1 : 0],
            ['eqrr', (r, a, b, c) => r[c] = r[a] === r[b] ? 1 : 0]
        ]);
        return ops;
    }
}

module.exports = Day16;
