// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day03');
const Solution = require('../fw/solution');

class Day03 extends Solution {
    constructor() { super(3, 'No Matter How You Slice It'); }

    part1() {
        this.rects = this.getRectangles();
        this.field = new Map();

        let overlapCount = 0;
        for (const rect of this.rects) {
            for (let x = rect.left; x < rect.left + rect.width; x++) {
                for (let y = rect.top; y < rect.top + rect.height; y++) {
                    const key = this.getKey(x, y);
                    let value = this.field.get(key);
                    if (value === undefined) {
                        value = 0;
                    } else if (value === 1) {
                        overlapCount++;
                    }
                    this.field.set(key, value + 1);
                }
            }
            this.progress(rect.id, this.rects.length);
        }

        return overlapCount;
    }

    part2() {
        for (const rect of this.rects) {
            let isValid = true;
            for (let x = rect.left; x < rect.left + rect.width && isValid; x++) {
                for (let y = rect.top; y < rect.top + rect.height && isValid; y++) {
                    if (this.field.get(this.getKey(x, y)) > 1) {
                        isValid = false;
                    }
                }
            }

            if (isValid) {
                return rect.id;
            }

            this.progress(rect.id, this.rects.length);
        }

        return 'no valid claim found';
    }

    getKey(x, y) {
        return `${x}-${y}`;
    }

    getRectangles() {
        const rectangles = [];
        for (const line of this.input) {
            const rectRegex = /#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)/g;
            const match = rectRegex.exec(line);
            if (match === undefined) { break; }

            const [, id, left, top, width, height] = match.map(x => parseInt(x, 10));
            const rectangle = {
                id, left, top, width, height
            };
            rectangles.push(rectangle);
        }

        return rectangles;
    }
}

module.exports = Day03;
