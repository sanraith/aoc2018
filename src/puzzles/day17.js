/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day17');
const fs = require('fs');
const Solution = require('../fw/solution');

const SPRING = '+';
const CLAY = '#';
const EMPTY = ' ';
const FLOW = '|';
const STILL = '~';

class Day17 extends Solution {
    constructor() { super(17, 'Reservoir Research'); }

    part1() {
        const map = this.parseInput();
        const springPos = this.pos(500, 0);
        this.fall(map, springPos);
        map.set(springPos, SPRING);
        const waterCount = Array.from(map.entries())
            .filter((e => this.pos(e[0]).y >= this.top && this.pos(e[0]).y <= this.bottom))
            .map(e => e[1])
            .reduce((acc, t) => acc + (t === STILL || t === FLOW), 0);

        return waterCount;
    }

    part2() {
        const map = this.parseInput();
        const springPos = this.pos(500, 0);
        this.fall(map, springPos);
        map.set(springPos, SPRING);
        const stillCount = Array.from(map.entries())
            .filter((e => this.pos(e[0]).y >= this.top && this.pos(e[0]).y <= this.bottom))
            .map(e => e[1])
            .reduce((acc, t) => acc + (t === STILL), 0);

        return stillCount;
    }

    /** @param { Map<number, string> } map
     * @param { number } waterPos */
    fall(map, waterPos) {
        map.set(waterPos, FLOW);
        const bottomPos = waterPos + this.pos(0, 1);
        const bottom = map.get(bottomPos);

        if (this.pos(bottomPos).y > this.bottom) {
            return false;
        }

        let canFillUp;
        switch (bottom) {
            case STILL: return this.spread(map, waterPos); // flowing onto still water
            case FLOW: return false; // flowing onto flowing water
            case CLAY: return this.spread(map, waterPos); // spread on clay
            case undefined:
                canFillUp = this.fall(map, bottomPos); // fall through empty
                return canFillUp ? this.spread(map, waterPos) : false;
            default: throw new Error('Invalid tile on map!');
        }
    }

    /** @param { Map<number, string> } map
     * @param { number } waterPos */
    spread(map, waterPos) {
        const { x: wx, y: wy } = this.pos(waterPos);
        let cl; let cr;
        for (let x = wx - 1; x >= this.left; x--) {
            if (map.get(this.pos(x, wy)) !== undefined) { cl = x; break; }
        }
        for (let x = wx + 1; x <= this.right; x++) {
            if (map.get(this.pos(x, wy)) !== undefined) { cr = x; break; }
        }

        let canFillUp = this.fillHorizontal(map, cl, cr, wy);
        if (canFillUp) { return true; }

        this.spreadHorizontal(map, this.pos(wx + 1, wy), 1);
        this.spreadHorizontal(map, this.pos(wx - 1, wy), -1);

        canFillUp = this.fillHorizontal(map, cl, cr, wy);

        return canFillUp;
    }

    /** @param { Map<number, string> } map
     * @param { number } cl
     * @param { number } cr
     * @param { number } wy */
    fillHorizontal(map, cl, cr, wy) {
        let canFillUp = true;
        if (cl !== undefined && cr !== undefined
            && map.get(this.pos(cl, wy)) !== FLOW && map.get(this.pos(cr, wy)) !== FLOW) {
            for (let x = cl + 1; x < cr; x++) {
                const tile = map.get(this.pos(x, wy + 1));
                if (tile !== CLAY && tile !== STILL && tile !== FLOW) { canFillUp = false; break; }
            }
        } else { canFillUp = false; }
        if (canFillUp) {
            for (let x = cl + 1; x < cr; x++) {
                map.set(this.pos(x, wy), STILL);
            }
        }

        return canFillUp;
    }

    /** @param { Map<number, string> } map
     * @param { number } pos
     * @param { number } dir */
    spreadHorizontal(map, pos, dir) {
        // eslint-disable-next-line prefer-const
        let { x, y } = this.pos(pos);
        const walls = new Set([CLAY, STILL]);
        while (walls.has(map.get(this.pos(x, y + 1))) && !walls.has(map.get(this.pos(x, y)))) {
            map.set(this.pos(x, y), FLOW);
            x += dir;
        }
        if (map.get(this.pos(x, y)) === undefined) {
            this.fall(map, this.pos(x, y));
        }
    }

    /** @param { Map<number, string> } map
     * @param { string } fname */
    visualize(map, fname) {
        const lines = [];
        for (let y = this.top; y <= this.bottom; y++) {
            const line = [];
            for (let x = this.left - 1; x <= this.right + 1; x++) {
                const pos = this.pos(x, y);
                if (map.has(pos)) {
                    line.push(map.get(pos));
                } else {
                    line.push(EMPTY);
                }
            }
            lines.push(line.join(''));
            if (!fname) {
                // eslint-disable-next-line no-console
                console.log(line.join(''));
            }
        }
        if (fname) { fs.writeFileSync(`c:\\temp\\${fname}.txt`, lines.join('\n')); }
    }

    parseInput() {
        const pattern = /([xy])=([0-9]+), ([xy])=([0-9]+)..([0-9]+)/;
        const walls = [];
        for (const line of this.input) {
            // eslint-disable-next-line no-restricted-globals
            const [, a, a1, b, b1, b2] = pattern.exec(line).map(x => isNaN(x) ? x : Number(x));
            for (let bi = b1; bi <= b2; bi++) {
                walls.push({ [a]: a1, [b]: bi });
            }
        }
        this.left = walls.reduce((acc, p) => Math.min(acc, p.x), Number.POSITIVE_INFINITY);
        this.right = walls.reduce((acc, p) => Math.max(acc, p.x), Number.NEGATIVE_INFINITY);
        this.top = walls.reduce((acc, p) => Math.min(acc, p.y), Number.POSITIVE_INFINITY);
        this.bottom = walls.reduce((acc, p) => Math.max(acc, p.y), Number.NEGATIVE_INFINITY);
        this.width = this.right + 2;
        const map = new Map(walls.map(p => [this.pos(p.x, p.y), CLAY]));

        return map;
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
