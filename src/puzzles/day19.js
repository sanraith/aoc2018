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
        let [a, b, c, ip, e, f] = r;

        // JUMP TO 17
        /*  0 */ ip = ip + 16;

        // JUMPED FROM 26, 35
        /*  1 */ f = 1;
        /*  2 */ c = 1;
        /*  3 */ b = f * c;

        /*  4 */ // b = b === e ? 1 : 0;
        /*  5 */ // ip = ip + b;
        /*  6 */ // ip = ip + 1;   // b !== e
        /*  7 */ // a += f;        // b === e
        /*  8 */ // c += 1;
        b = (b === e ? 1 : 0);
        if (b === e) {
            a += f;
        }
        c++;

        // JUMP TO 3 if c <= e ELSE CONTINUE ON 12
        /*  9 */ b = c > e ? 1 : 0;
        /* 10 */ ip = ip + b;
        /* 11 */ ip = 2;        // b == 0; c <= e;

        /* 12 */ f += 1;        // b == 1; c > e;

        // JUMP TO 2 if f <= e, ELSE END
        /* 13 */ b = f > e ? 1 : 0;
        /* 14 */ ip = ip + b;
        /* 15 */ ip = 1;        // b == 0; f <= e
        /* 16 */ ip = ip * ip;  // b == 1; f > e

        // JUMPED FROM 0
        /* 17 */ e += 2;
        /* 18 */ e = e * e;
        /* 19 */ e = 19 * e;    //e = ip * e;
        /* 20 */ e += 11;
        /* 21 */ b += 6;
        /* 22 */ b = b * 22;    //b = b * ip;
        /* 23 */ b = b + 10;
        /* 24 */ e = e + b;

        // SKIP some based on a condition
        /* 25 */ ip = ip + a;

        // LOOP to 1
        /* 26 */ ip = 0;

        /* 27 */ b = 27;        //b = ip;
        /* 28 */ b = b * 28;    //b = b * ip;
        /* 29 */ b += 29;       //b = ip + b;
        /* 30 */ b = 30 * b;    //b = ip * b;
        /* 31 */ b += 14;
        /* 32 */ b = b * 32;    //b = b * ip;
        /* 33 */ e = e + b;

        // RESET A?
        /* 34 */ a = 0;

        // LOOP TO 1
        /* 35 */ ip = 0;

        return a;
    }

    convertSourceToJs() {
        const { ip, program } = this.parseInput();
        const conversions = this.getConversions(ip);
        for (const [i, [cmd, params]] of program.entries()) {
            console.log(`/* ${('' + i).padStart(2, ' ')} */ ${conversions.get(cmd)(null, ...params)};`);
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

    getConversions(ip) {
        const l = ['a', 'b', 'c', 'd', 'e', 'f']; l[ip] = 'ip';
        const ops = new Map([
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
        return ops;
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
