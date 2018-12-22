// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day22');
const Solution = require('../fw/solution');

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

class Day22 extends Solution {
    constructor() { super(22, 'Mode Maze'); }

    part1() {
        const { depth, x: tx, y: ty } = this.parseInput();
        const levels = this.getLevels(depth, tx, ty);

        let risk = 0;
        for (let y = 0; y <= ty; y++) {
            for (let x = 0; x <= tx; x++) {
                risk += levels.get(getPos(x, y)) % 3;
            }
        }

        return risk;
    }

    part2() {

    }

    getLevels(depth, tx, ty) {
        const levels = new Map();
        for (let y = 0; y <= ty; y++) {
            for (let x = 0; x <= tx; x++) {
                this.getLevel(levels, depth, tx, ty, getPos(x, y));
            }
        }

        return levels;
    }

    getLevel(levels, depth, tx, ty, pos) {
        if (levels.has(pos)) {
            return levels.get(pos);
        }
        const { x, y } = getPos(pos);

        let gIndex;
        if ((x === 0 && y === 0) || (x === tx && y === ty)) {
            gIndex = 0;
        } else if (y === 0) {
            gIndex = x * 16807;
        } else if (x === 0) {
            gIndex = y * 48271;
        } else {
            gIndex = this.getLevel(levels, depth, tx, ty, pos + LEFT)
                * this.getLevel(levels, depth, tx, ty, pos + UP);
        }
        const level = (gIndex + depth) % 20183;
        levels.set(pos, level);

        return level;
    }

    visualize(levels, tx, ty) {
        const chars = ['.', '=', '|'];
        const lines = [];
        for (let y = 0; y <= ty; y++) {
            const line = [];
            for (let x = 0; x <= tx; x++) {
                const char = chars[levels.get(getPos(x, y)) % 3];
                line.push(char);
            }
            lines.push(line.join(''));
            debug(line.join(''));
        }
        this.frame(lines);
    }

    parseInput() {
        const [, depth] = /.* ([0-9]+)/.exec(this.input[0]).map(Number);
        const [, x, y] = /.* ([0-9]+),([0-9]+)/.exec(this.input[1]).map(Number);
        return { depth, x, y };
    }
}

module.exports = Day22;
