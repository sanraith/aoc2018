/* eslint-disable */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
/* eslint-disable no-return-assign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day21');
const Solution = require('../fw/solution');

class Day21 extends Solution {
    constructor() { super(21, 'Chronal Conversion'); }

    part1() {
        const target = this.part2Transpiled();
        return target;
    }

    part2() {
        const target = this.part2Transpiled(true);
        return target;
    }

    part2Transpiled(mostInstructions = false) {
        const validParams = new Set();
        const r = [0, 0, 0, 0, 0, 0];
        let [a, b, c, ip, e, f] = r;

        // bitwise check
        /*  0 */ e = 123;
        /*  1 */ e = e & 456;
        if (e !== 72) { throw new Error('Invalid result'); }

        /*  5 */ e = 0;
        while (true) {
            /*  6 */ c = e | 65536;         //        10000000000000000
            /*  7 */ e = 6152285;           //  10111011110000001011101

            while (true) {
                /*  8 */ b = c & 255;       //                 11111111
                /*  9 */ e = e + b;
                /* 10 */ e = e & 16777215;  // 111111111111111111111111
                /* 11 */ e = e * 65899;
                /* 12 */ e = e & 16777215;  // 111111111111111111111111
                if (c < 256) { break; }
                /* 17 */ b = 0;
                while (true) {
                    /* 18 */ f = b + 1;
                    /* 19 */ f = f * 256;
                    if (f > c) { break; }
                    /* 24 */ b = b + 1;
                }
                /* 26 */ c = b;
            }

            if (mostInstructions) {
                if (validParams.has(e)) {
                    return [...validParams].pop();
                }
                validParams.add(e);
            } else {
                return e;
            }

            if (e === a) { break; }
        }
    }

    printConvertedSource() {
        const { ip, program } = this.parseInput();
        const conversions = this.getTranslations(ip);
        for (const [i, [cmd, params]] of program.entries()) {
            // eslint-disable-next-line no-console
            console.log(`/* ${(`${i}`).padStart(2, ' ')} */ ${conversions.get(cmd)(null, ...params)};`);
        }
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
