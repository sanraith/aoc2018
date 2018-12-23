// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day23');
const Solution = require('../fw/solution');

class Day23 extends Solution {
    constructor() { super(23, 'Experimental Emergency Teleportation'); }

    part1() {
        const bots = this.parseInput();
        bots.sort((a, b) => b.r - a.r);
        const inRange = bots.reduce(
            (acc, b) => acc + (this.manhattan(b, bots[0]) <= bots[0].r), 0
        );

        return inRange;
    }

    part2() {
        const bots = this.parseInput();
        const start = { x: 0, y: 0, z: 0 };

        const minMaxMap = new Map([...'xyz'].map(c => [c,
            { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }]));
        for (const bot of bots) {
            for (const c of [...'xyz']) {
                const v = bot[c];
                const minMax = minMaxMap.get(c);
                minMax.min = Math.min(minMax.min, v);
                minMax.max = Math.max(minMax.max, v);
            }
        }
        debug(minMaxMap);

    }

    manhattan(bot1, bot2) {
        return Math.abs(bot1.x - bot2.x)
            + Math.abs(bot1.y - bot2.y)
            + Math.abs(bot1.z - bot2.z);
    }

    parseInput() {
        const pattern = /pos=<([-0-9]+),([-0-9]+),([-0-9]+)>, r=([-0-9]+)/;
        const bots = [];
        for (const line of this.input) {
            const [, x, y, z, r] = pattern.exec(line).map(Number);
            bots.push({ x, y, z, r });
        }
        return bots;
    }
}

module.exports = Day23;
