/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
/* eslint-disable no-return-assign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day21');
const Solution = require('../fw/solution');

class Day21 extends Solution {
    constructor() { super(21, 'Chronal Conversion'); }

    part1() {
        this.printConvertedSource();
        return 0;

        // const { ip, program } = this.parseInput();
        // const r = [0, 0, 0, 0, 0, 0];
        // // eslint-disable-next-line no-cond-assign
        // while (this.runProgram(program, ip, r.slice()).infinite) {
        //     debug(`${r}: infinite`);
        //     r[0]++;
        // }

        // return r;
    }

    part2() {

    }


    printConvertedSource() {
        const { ip, program } = this.parseInput();
        const conversions = this.getTranslations(ip);
        for (const [i, [cmd, params]] of program.entries()) {
            // eslint-disable-next-line no-console
            console.log(`/* ${(`${i}`).padStart(2, ' ')} */ ${conversions.get(cmd)(null, ...params)};`);
        }
    }

    runProgram(program, ip, r = [0, 0, 0, 0, 0, 0]) {
        const states = new Set();
        const ops = this.getOps();
        while (r[ip] >= 0 && r[ip] < program.length) {
            const state = this.getState(r);
            if (states.has(state)) {
                return { infinite: true };
            }
            states.add(state);

            const instruction = program[r[ip]];
            const op = ops.get(instruction[0]);

            op(r, ...instruction[1]);
            r[ip]++;
        }

        return { r, infinite: false };
    }

    getState(r) {
        return r.join(',');
    }

    parseInput() {
        const ipPattern = /#ip ([0-9]+)/;
        const cmdPattern = /([a-z]+) ([0-9]+) ([0-9]+) ([0-9]+)/;
        const program = [];
        const [, ip] = ipPattern.exec(this.input[0]).map(Number);
        for (const line of this.input.slice(1)) {
            // eslint-disable-next-line no-restricted-globals
            const [, command, ...params] = cmdPattern.exec(line).map(x => isNaN(x) ? x : Number(x));
            program.push([command, params]);
        }

        return { ip, program };
    }

    getTranslations(ip) {
        const l = ['a', 'b', 'c', 'd', 'e', 'f']; l[ip] = 'ip';
        const translations = new Map([
            ['addr', (r, a, b, c) => `${l[c]} = ${l[a]} + ${l[b]}`],
            ['addi', (r, a, b, c) => `${l[c]} = ${l[a]} + ${b}`],

            ['mulr', (r, a, b, c) => `${l[c]} = ${l[a]} * ${l[b]}`],
            ['muli', (r, a, b, c) => `${l[c]} = ${l[a]} * ${b}`],

            ['banr', (r, a, b, c) => `${l[c]} = ${l[a]} & ${l[b]}`],
            ['bani', (r, a, b, c) => `${l[c]} = ${l[a]} & ${b}`],

            ['borr', (r, a, b, c) => `${l[c]} = ${l[a]} | ${l[b]}`],
            ['bori', (r, a, b, c) => `${l[c]} = ${l[a]} | ${b}`],

            ['setr', (r, a, b, c) => `${l[c]} = ${l[a]}`],
            ['seti', (r, a, b, c) => `${l[c]} = ${a}`],

            ['gtir', (r, a, b, c) => `${l[c]} = ${a} > ${l[b]} ? 1 : 0`],
            ['gtri', (r, a, b, c) => `${l[c]} = ${l[a]} > ${b} ? 1 : 0`],
            ['gtrr', (r, a, b, c) => `${l[c]} = ${l[a]} > ${l[b]} ? 1 : 0`],

            ['eqir', (r, a, b, c) => `${l[c]} = ${a} === ${l[b]} ? 1 : 0`],
            ['eqri', (r, a, b, c) => `${l[c]} = ${l[a]} === ${b} ? 1 : 0`],
            ['eqrr', (r, a, b, c) => `${l[c]} = ${l[a]} === ${l[b]} ? 1 : 0`]
        ]);
        return translations;
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

module.exports = Day21;
