// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day20');
const Solution = require('../fw/solution');

const TYPE_BRANCH = 'branch';
const TYPE_SEQUENCE = 'sequence';

class Day20 extends Solution {
    constructor() { super(20, 'A Regular Map'); }

    part1() {
        const expression = this.parseInput();
        debug(expression);
    }

    part2() {

    }

    parseInput() {
        const input = [...this.input[0]];
        const { branches } = this.parseRec(input);

        return branches;
    }

    parseRec(input) {
        let part = [];
        let expr = { type: TYPE_SEQUENCE, parts: [] };
        const branch = { type: TYPE_BRANCH, paths: [expr] };
        let result;
        for (let i = 0; i < input.length; i++) {
            const c = input[i];
            switch (c) {
                case '^': break;
                case '(':
                    // eslint-disable-next-line no-case-declarations
                    if (part.length > 0) { expr.parts.push(part.join('')); }
                    part = [];
                    result = this.parseRec(input.slice(i + 1));
                    expr.parts.push(result.branches);
                    i += result.count;
                    break;
                case '|':
                    if (part.length > 0) { expr.parts.push(part.join('')); }
                    part = [];
                    expr = { type: TYPE_SEQUENCE, parts: [] };
                    branch.paths.push(expr);
                    break;
                case '$':
                case ')':
                    if (part.length > 0) { expr.parts.push(part.join('')); }
                    return { branches: branch, count: i + 1 };
                default:
                    part.push(c);
                    break;
            }
        }
        throw new Error('Unreachable code rached!');
    }
}

module.exports = Day20;
