/* eslint-disable no-param-reassign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day06');
const Solution = require('../fw/solution');

class Day06 extends Solution {
    constructor() { super(6, 'Chronal Coordinates'); }

    part1() {
        const coords = this.parseCoords();
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

        // translate coords to minimize field size, leaving a 1 cell thick border border
        this.translate(coords, bounds, bounds.left - 1, bounds.top - 1);

        // generate field
        const field = new Array(bounds.bottom + 2);
        for (const index of field.keys()) {
            field[index] = new Array(bounds.right + 2);
        }

        // fill field with distances
        const areaSizes = Array.from(new Map(coords.map((_, i) => [i, 0])).values());
        for (const [y, line] of field.entries()) {
            this.progress(y, field.length);
            for (const x of line.keys()) {
                let minDist = Number.POSITIVE_INFINITY;
                let minIndex;
                for (const [index, coord] of coords.entries()) {
                    const dist = this.manhattan(x, y, coord);
                    if (dist < minDist) {
                        minDist = dist;
                        minIndex = index;
                    } else if (minDist === dist) {
                        minIndex = '.';
                    }
                }
                if (this.isOnBorder(x, y, bounds)) {
                    areaSizes[minIndex] = undefined;
                } else if (areaSizes[minIndex] !== undefined) {
                    areaSizes[minIndex] += 1;
                }
                line[x] = minIndex;
            }
        }

        return Math.max(...areaSizes.map(x => x === undefined ? -1 : x));
    }

    part2() {
        const coords = this.parseCoords();
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
        const diff = 10000;

        let count = 0;
        for (let y = bounds.top - diff; y < bounds.bottom + diff; y++) {
            for (let x = bounds.left - diff; x < bounds.right + diff; x++) {
                const sum = coords.reduce((acc, c) => acc + this.manhattan(x, y, c), 0);
                if (sum < diff) {
                    count++;
                }
            }

            this.progress(y, bounds.bottom + diff, bounds.top - diff);
        }

        return count;
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
