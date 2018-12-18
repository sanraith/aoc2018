// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day18');
const Solution = require('../fw/solution');

const EMPTY = ' ';
const OPEN = '.';
const TREE = '|';
const LUMBER = '#';

class Day18 extends Solution {
    constructor() { super(18, 'Settlers of The North Pole'); }

    part1() {
        let map = this.parseInput();
        for (let i = 0; i < 10; i++) {
            this.visualize(map);
            map = this.tick(map);
        }
        this.visualize(map);

        return this.resourceValue(map);
    }

    part2() {
        const minuteCount = 1000000000;

        let map = this.parseInput();
        const hashes = new Map();
        for (let i = 0; i < minuteCount; i++) {
            this.progress(i, minuteCount);
            this.visualize(map);

            map = this.tick(map);
            const hash = this.hash(map);
            if (hashes.has(hash)) {
                const lastIndex = hashes.get(hash);
                const periodLength = i - lastIndex;
                const remainingLength = minuteCount - lastIndex;
                const jump = remainingLength - (remainingLength % periodLength);
                i = lastIndex + jump;
                hashes.clear();
            } else {
                hashes.set(hash, i);
            }
        }
        this.visualize(map);

        return this.resourceValue(map);
    }

    hash(map) {
        return [...map.values()].join('');
    }

    resourceValue(map) {
        const woodCount = [...map.values()].reduce((acc, t) => acc + (t === TREE), 0);
        const lumberCount = [...map.values()].reduce((acc, t) => acc + (t === LUMBER), 0);
        return woodCount * lumberCount;
    }

    /** @param { Map<number, string> } map */
    tick(map) {
        const map2 = new Map();
        for (const pos of map.keys()) {
            const neighbours = { [OPEN]: 0, [TREE]: 0, [LUMBER]: 0 };
            for (const delta of this.directions) {
                neighbours[map.get(pos + delta)]++;
            }
            const tile = map.get(pos);
            map2.set(pos, tile);
            switch (tile) {
                case OPEN: if (neighbours[TREE] >= 3) { map2.set(pos, TREE); } break;
                case TREE: if (neighbours[LUMBER] >= 3) { map2.set(pos, LUMBER); } break;
                case LUMBER: if (!(neighbours[LUMBER] > 0 && neighbours[TREE] > 0)) { map2.set(pos, OPEN); } break;
                default: throw new Error('Invalid tile!');
            }
        }
        return map2;
    }

    /** @return { Map<number, string> } */
    parseInput() {
        this.width = this.input.reduce((acc, l) => l.length > acc ? l.length : acc, 0) + 1;
        this.height = this.input.length;
        const map = new Map();
        for (const [y, line] of this.input.entries()) {
            for (const [x, c] of [...line].entries()) {
                map.set(this.pos(x, y), c);
            }
        }

        /** @type { Array<number> } Single coordinates representing the 8 directions. */
        this.directions = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) { continue; }
                this.directions.push(this.pos(x, y));
            }
        }

        return map;
    }

    /** @param { Map<number, string> } map */
    visualize(map) {
        if (!this.visualizationOn) { return; }
        const lines = [];
        for (let y = 0; y < this.height; y++) {
            const line = [];
            for (let x = 0; x < this.width; x++) {
                const pos = this.pos(x, y);
                if (map.has(pos)) {
                    line.push(map.get(pos));
                } else {
                    line.push(EMPTY);
                }
            }
            lines.push(line.join(''));
        }
        this.frame(lines);
    }

    /** Converts back and forth between [x, y] and [p] type coordinates.
     * @param { number } p
     * @param { number } y
     * @return { number } p
     * @return { {x: number, y: number} } { x, y } */
    pos(p, y = undefined) {
        if (y === undefined) {
            const y2 = Math.floor(p / this.width);
            return { x: p - y2 * this.width, y: y2 };
        }
        return y * this.width + p;
    }
}

module.exports = Day18;
