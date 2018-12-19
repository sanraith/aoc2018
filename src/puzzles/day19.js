/* eslint-disable no-unused-vars */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day19');
const Solution = require('../fw/solution');

class Day19 extends Solution {
    constructor() { super(19, 'Go With The Flow'); }

    part1() {
        const { ip, program } = this.parseInput();
        const registers = this.runProgram(program, ip);

        return registers[0];
    }

    part2() {
        this.printConvertedSource();
        const { ip, program } = this.parseInput();
        const modes = { translated: 0, injected: 1, rewritten: 2 };
        const mode = modes.rewritten;

        switch (mode) {
            case modes.translated: // ~too much
                return this.part2Translated();
            case modes.injected: // ~4 sec
                return this.runProgram(program, ip, [1, 0, 0, 0, 0, 0])[0];
            case modes.rewritten: // ~0 sec
                return this.part2Rewritten();
            default:
                return undefined;
        }
    }

    part2Rewritten() {
        const target = 10551378;
        let sum = 0;
        for (let i = 1; i <= target; i++) {
            sum += target % i === 0 ? i : 0;
        }
        return sum;
    }

    part2Translated() {
        const r = [1, 0, 0, 0, 0, 0];
        let [a, b, c, ip, targetE, f] = r;

        // JUMP TO 17
        /*  0 */ ip += 16;
        // EASY MODE INITIALIZE
        /* 17 */ targetE += 2;
        /* 18 */ targetE *= targetE;
        /* 19 */ targetE *= 19; // e = ip * e;
        /* 20 */ targetE *= 11;
        /* 21 */ b += 6;
        /* 22 */ b *= 22; // b = b * ip;
        /* 23 */ b += 10;
        /* 24 */ targetE += b;
        // JUMP TO 1 IF EASY MODE, ELSE CONTINUE 27
        /* 25 */ ip += a;
        // /* 26 */ ip = 0; // NO EASY MODE
        // HARD MODE INITIALIZE
        /* 27 */ b = 27; // b = ip;
        /* 28 */ b *= 28; // b = b * ip;
        /* 29 */ b += 29; // b = ip + b;
        /* 30 */ b *= 30; // b = ip * b;
        /* 31 */ b *= 14;
        /* 32 */ b *= 32; // b = b * ip;
        /* 33 */ targetE += b;
        /* 34 */ a = 0;
        // JUMP TO 1
        /* 35 */ ip = 0;
        /*  1 */ f = 1;

        do { /*  2 */ // f = 1..targetE
            c = 1;
            do { /*  3 */ // c = 1..targetE
                b = f * c;
                if (b === targetE) {
                    a += f;
                }
                c++;
            } while (c <= targetE); /* 11 */

            /* 12 */ f++;
            if (f > targetE) {
                break;
            }
            this.progress(f, targetE);
        } while (f <= targetE); /* 15 */

        return a;
    }

    printConvertedSource() {
        const { ip, program } = this.parseInput();
        const conversions = this.getTranslations(ip);
        for (const [i, [cmd, params]] of program.entries()) {
            // eslint-disable-next-line no-console
            debug(`/* ${(`${i}`).padStart(2, ' ')} */ ${conversions.get(cmd)(null, ...params)};`);
        }
    }

    runProgram(program, ip, r = [0, 0, 0, 0, 0, 0]) {
        const ops = this.getOps();
        while (r[ip] >= 0 && r[ip] < program.length) {
            const instruction = program[r[ip]];
            const op = ops.get(instruction[0]);

            // Replace slow modulo implementation
            if (r[ip] === 2) {
                this.progress(r[5], r[4]);
                r[0] += ((r[4] % r[5] === 0) ? r[5] : 0);
                r[ip] = 12;
            } else {
                op(r, ...instruction[1]);
                r[ip]++;
            }
        }

        return r;
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
            ['bori', (r, a, b, c) => `${l[c]} = ${l[a]} & ${b}`],

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

module.exports = Day19;
