/* eslint-disable no-param-reassign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day06');
const Solution = require('../fw/solution');

class Day06 extends Solution {
    constructor() { super(6, 'Chronal Coordinates'); }

    part1() {
        const coords = this.parseCoords();
        const bounds = this.getBounds(coords);
        // translate coords to minimize field size, leaving a 1 cell thick border border
        this.translate(coords, bounds, bounds.left - 1, bounds.top - 1);

        const areaSizes = coords.map(() => 0);
        for (let y = 0; y < bounds.bottom + 1; y++) {
            this.progress(y, bounds.bottom + 1);
            for (let x = 0; x < bounds.right + 1; x++) {
                let minDist = Number.POSITIVE_INFINITY;
                let minIndex;
                for (const [index, coord] of coords.entries()) {
                    const dist = this.manhattan(x, y, coord);
                    if (dist < minDist) {
                        minDist = dist;
                        minIndex = index;
                    }
                }
                if (this.isOnBorder(x, y, bounds)) {
                    areaSizes[minIndex] = undefined;
                } else if (areaSizes[minIndex] !== undefined) {
                    areaSizes[minIndex]++;
                }
            }
        }

        return areaSizes.reduce((max, s = -1) => Math.max(max, s), -1);
    }

    part2() {
        const coords = this.parseCoords();
        const bounds = this.getBounds(coords);
        const diff = 10000;

        let areaSize = 0;
        for (let y = bounds.top - diff; y < bounds.bottom + diff; y++) {
            this.progress(y, bounds.bottom + diff, bounds.top - diff);
            for (let x = bounds.left - diff; x < bounds.right + diff; x++) {
                let sum = 0;
                for (const coord of coords) {
                    sum += this.manhattan(x, y, coord);
                    if (sum >= diff) { break; }
                }
                if (sum < diff) {
                    areaSize++;
                }
            }
        }

        return areaSize;
    }

    isOnBorder(x, y, bounds) {
        return x === 0 || y === 0 || x > bounds.right || y > bounds.bottom;
    }

    manhattan(x, y, coord) {
        return Math.abs(x - coord.x) + Math.abs(y - coord.y);
    }

    translate(coords, bounds, left, top) {
        for (const coord of coords) {
            coord.x -= left;
            coord.y -= top;
        }
        bounds.left -= left;
        bounds.right -= left;
        bounds.top -= top;
        bounds.bottom -= top;
    }

    getBounds(coords) {
        const bounds = {
            left: coords[0].x,
            right: coords[0].x,
            top: coords[0].y,
            bottom: coords[0].y
        };
        for (const coord of coords) {
            bounds.left = Math.min(bounds.left, coord.x);
            bounds.right = Math.max(bounds.right, coord.x);
            bounds.top = Math.min(bounds.top, coord.y);
            bounds.bottom = Math.max(bounds.bottom, coord.y);
        }
        return bounds;
    }

    parseCoords() {
        const coords = [];
        for (const line of this.input) {
            const [, x, y] = /([0-9]+), ([0-9]+)/.exec(line).map(n => parseInt(n, 10));
            coords.push({ x, y });
        }
        return coords;
    }
}

module.exports = Day06;
