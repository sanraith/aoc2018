// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day17');
const Solution = require('../fw/solution');

class Day17 extends Solution {
    constructor() { super(17, 'Reservoir Research'); }

    part1() {
        this.parseInput();
    }

    part2() {

    }

    /** @return { Array<{x: number, y: number}> } */
    parseInput() {
        const pattern = /([xy])=([0-9]+), ([xy])=([0-9]+)..([0-9]+)/;
        let walls = [];
        for (const line of this.input) {
            // eslint-disable-next-line no-restricted-globals
            const [, a, a1, b, b1, b2] = pattern.exec(line).map(x => isNaN(x) ? x : Number(x));
            for (let bi = b1; bi <= b2; bi++) {
                walls.push({ [a]: a1, [b]: bi });
            }
        }
        this.width = walls.reduce((acc, p) => p.x > acc ? p.x : acc, 0) + 1;

        walls = walls.map(p => ({ ...p, pos1: this.pos(p.x, p.y), pos2: this.pos(this.pos(p.x, p.y)) }));
        debug(walls);

        return walls;
    }

    /** Converts back and forth between [x, y] and [p] type coordinates.
     * @param { number } p
     * @param { number } y
     * @return { number | {x: number, y: number} } p or { x, y } */
    pos(p, y = undefined) {
        if (y === undefined) {
            const y2 = Math.floor(p / this.width);
            return { x: p - y2 * this.width, y: y2 };
        }
        return y * this.width + p;
    }
}

module.exports = Day17;
