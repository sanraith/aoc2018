/* eslint-disable */
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

    part2Slooooooow() {
        const { ip, program } = this.parseInput();
        const registers = this.runProgram(program, ip, [1, 0, 0, 0, 0, 0]);

        return registers[0];
    }

    part2() {
        const r = [1, 0, 0, 0, 0, 0];
        let [a, b, c, ip, targetE, f] = r;

        // JUMP TO 17
        /*  0 */ ip += 16;

        // JUMPED FROM 0
        // EASY MODE INITIALIZE
        /* 17 */ targetE += 2;
        /* 18 */ targetE *= targetE;
        /* 19 */ targetE *= 19; // e = ip * e;
        /* 20 */ targetE += 11;
        /* 21 */ b += 6;
        /* 22 */ b *= 22; // b = b * ip;
        /* 23 */ b += 10;
        /* 24 */ targetE += b;

        // JUMP TO 1 IF EASY MODE, ELSE CONTINUE 27
        // /* 25 */ ip += a;
        // /* 26 */ ip = 0; // NO EASY MODE :(

        // HARD MODE INITIALIZE
        /* 27 */ b = 27; // b = ip;
        /* 28 */ b *= 28; // b = b * ip;
        /* 29 */ b += 29; // b = ip + b;
        /* 30 */ b *= 30; // b = ip * b;
        /* 31 */ b += 14;
        /* 32 */ b *= 32; // b = b * ip;
        /* 33 */ targetE += b;
        /* 34 */ a = 0;
        // JUMP TO 1
        // /* 35 */ ip = 0;

        // JUMPED FROM 26, 35 (FROM INITIALIZE)
        /*  1 */ f = 1;

        // a=0 b=754048 c=0 ip=0 e=754277 f=1
        debug(a, b, c, ip, targetE, f);

        let result = 0;
        for (let f1 = 1; f1 <= targetE; f1++) {
            if (targetE % f1 === 0) {
                result += f1;
            }
        }
        return result;

        // count(x=1..754277, 754277 % x == 0 ? x : 0)*2
        // 772716 too low.
        // 1545432 too low.

        do { /*  2 */ // f = 1..754277
            c = 1;
            do { /*  3 */ // c = 1..754277
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

    convertSourceToJs() {
        const { ip, program } = this.parseInput();
        const conversions = this.getTranslations(ip);
        for (const [i, [cmd, params]] of program.entries()) {
            // eslint-disable-next-line no-console
            console.log(`/* ${(`${i}`).padStart(2, ' ')} */ ${conversions.get(cmd)(null, ...params)};`);
        }
    }

    runProgram(program, ip, r = [0, 0, 0, 0, 0, 0]) {
        const ops = this.getOps();
        while (r[ip] >= 0 && r[ip] < program.length) {
            const instruction = program[r[ip]];
            const op = ops.get(instruction[0]);
            op(r, ...instruction[1]);
            r[ip]++;
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
            ['muli', (r, a, b, c) => `${l[c]} = ${l[a]} + ${b}`],

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
