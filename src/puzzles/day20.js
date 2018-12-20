// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day20');
const Solution = require('../fw/solution');

const TYPE_BRANCH = 'branch';
const TYPE_SEQUENCE = 'sequence';
const MAXSIZE = 1000000;

/** Converts back and forth between [x, y] and [p] type coordinates.
 * @param { number } p
 * @param { number } y
 * @return { number } p
 * @return { {x: number, y: number} } { x, y } */
function getPos(p, y = undefined) {
    if (y === undefined) {
        const y2 = Math.floor(p / MAXSIZE);
        return { x: p - y2 * MAXSIZE, y: y2 };
    }
    return y * MAXSIZE + p;
}

const [UP, RIGHT, DOWN, LEFT] = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(p => getPos(...p));
const DIRECTIONS = [UP, RIGHT, DOWN, LEFT];
const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(p => getPos(...p));
const DIRMAP = new Map([['N', UP], ['E', RIGHT], ['S', DOWN], ['W', LEFT]]);
const EMPTY = '.';
const DOOR = '-';
const WALL = '#';
const UNKNOWN = '?';

class Day20 extends Solution {
    constructor() { super(20, 'A Regular Map'); }

    part1() {
        const expression = this.parseInput();
        const map = new Map([[0, 'X']]);
        this.createMap(map, 0, expression);
        this.visualize(map);
    }

    part2() {

    }

    createMap(map, pos2, expression) {
        let pos = pos2;
        if (expression.type === TYPE_BRANCH) {
            for (const path of expression.paths) {
                this.createMap(map, pos, path);
            }
        } else if (expression.type === TYPE_SEQUENCE) {
            for (const part of expression.parts) {
                pos = this.createMap(map, pos, part);
            }
        } else { // expression is string
            for (const c of [...expression]) {
                const delta = DIRMAP.get(c);
                map.set(pos + delta, DOOR);
                pos += 2 * delta;
                map.set(pos, EMPTY);
                for (const d of CORNERS) {
                    map.set(pos + d, WALL);
                }
                for (const d of DIRECTIONS) {
                    if (!map.has(pos + d)) { map.set(pos + d, UNKNOWN); }
                }
            }
        }

        return pos;
    }

    /** @param { Map<number, string> } map */
    visualize(map) {
        if (!this.visualizationOn) { return; }
        const lines = [];
        for (let y = -10; y < 20; y++) {
            const line = [];
            for (let x = -20; x < 10; x++) {
                const pos = getPos(x, y);
                if (map.has(pos)) {
                    line.push(map.get(pos));
                } else {
                    line.push(' ');
                }
            }
            lines.push(line.join(''));
        }
        this.frame(lines);
        for (const line of lines) {
            debug(line);
        }
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
            if (['(', '|', ')', '$'].includes(c)) {
                if (part.length > 0) { expr.parts.push(part.join('')); }
                part = [];
            }
            switch (c) {
                case '^': break;
                case '(':
                    result = this.parseRec(input.slice(i + 1));
                    expr.parts.push(result.branches);
                    i += result.count;
                    break;
                case '|':
                    expr = { type: TYPE_SEQUENCE, parts: [] };
                    branch.paths.push(expr);
                    break;
                case ')':
                case '$':
                    return { branches: branch, count: i + 1 };
                default:
                    part.push(c);
                    break;
            }
        }
        throw new Error('Unreachable code reached!');
    }
}

module.exports = Day20;
