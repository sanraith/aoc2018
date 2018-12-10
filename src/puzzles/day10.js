// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day10');
const Solution = require('../fw/solution');

function sqr(x) { return x * x; }
function sqrt(x) { return Math.sqrt(x); }

class Day10 extends Solution {
    constructor() { super(10, 'The Stars Align'); }

    part1() {
        return this.solve().map.reduce((acc, x) => `${acc}\n${x.join('')}`, '');
    }

    part2() {
        return this.solve().correctTime;
    }

    solve() {
        const stars = this.parseCoords();

        const ref = stars[0];
        const diffs = stars.slice(1).map(x => this.getCollision(ref, x, 100));
        let minTime = diffs.reduce((acc, x) => x[0] > acc ? x[0] : acc, Number.NEGATIVE_INFINITY);
        let maxTime = diffs.reduce((acc, x) => x[1] < acc ? x[1] : acc, Number.POSITIVE_INFINITY);
        [minTime, maxTime] = [Math.ceil(Math.max(0, minTime)), Math.floor(maxTime)].sort();

        let minSize = Number.POSITIVE_INFINITY;
        let correctTime;
        this.progressTime(stars, minTime);
        for (let i = minTime; i < maxTime; i++) {
            const size = this.visualize(stars, false).size;
            if (size < minSize) {
                correctTime = i;
                minSize = size;
            }
            this.progressTime(stars, 1);
        }

        this.progressTime(stars, correctTime - maxTime);
        const { map } = this.visualize(stars, true);

        return { correctTime, map };
    }

    progressTime(stars, time) {
        for (const star of stars) {
            star.x += star.vx * time;
            star.y += star.vy * time;
        }
    }

    visualize(stars, drawResult) {
        const minX = stars.reduce((acc, x) => x.x < acc ? x.x : acc, Number.POSITIVE_INFINITY);
        const maxX = stars.reduce((acc, x) => x.x > acc ? x.x : acc, Number.NEGATIVE_INFINITY);
        const minY = stars.reduce((acc, x) => x.y < acc ? x.y : acc, Number.POSITIVE_INFINITY);
        const maxY = stars.reduce((acc, x) => x.y > acc ? x.y : acc, Number.NEGATIVE_INFINITY);
        const map = [];
        if (drawResult) {
            for (let i = 0; i < maxY - minY + 1; i++) {
                map[i] = [];
                for (let j = 0; j < maxX - minX + 1; j++) {
                    map[i][j] = ' ';
                }
            }
            for (const star of stars) {
                const [x, y] = [star.x - minX, star.y - minY];
                map[y][x] = '*';
            }
        }

        return { size: (maxX - minX) * (maxY - minY), map };
    }

    getCollision(e1, e2, collisionDistance) {
        const a = e1.Fx.A - e2.Fx.A;
        const b = e1.Fx.B - e2.Fx.B;
        const c = e1.Fy.A - e2.Fy.A;
        const d = e1.Fy.B - e2.Fy.B;

        if (b === 0 && d === 0) {
            return [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
        }

        // eslint-disable-next-line no-underscore-dangle
        const _2ab = 2 * a * b;
        // eslint-disable-next-line no-underscore-dangle
        const _2cd = 2 * c * d;
        const a2 = sqr(a);
        const b2 = sqr(b);
        const c2 = sqr(c);
        const d2 = sqr(d);
        const z2 = sqr(collisionDistance);

        const t1 = (-sqrt(sqr(_2ab + _2cd) - 4 * (b2 + d2) * (a2 + c2 - z2)) - _2ab - _2cd) / (2 * (b2 + d2));
        const t2 = (sqrt(sqr(_2ab + _2cd) - 4 * (b2 + d2) * (a2 + c2 - z2)) - _2ab - _2cd) / (2 * (b2 + d2));

        return [t1, t2].sort();
    }

    parseCoords() {
        const coords = [];
        for (const line of this.input) {
            const [, x, y, vx, vy] = /position.*?([-0-9]+),.*?([-0-9]+)> velocity=<.*?([-0-9]+),.*?([-0-9]+)>/
                .exec(line).map(Number);
            coords.push({
                // eslint-disable-next-line object-property-newline
                x, y, vx, vy,
                Fx: { A: x, B: vx },
                Fy: { A: y, B: vy }
            });
        }
        return coords;
    }
}

module.exports = Day10;
