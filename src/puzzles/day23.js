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
        const [p1Weight, p2Weight] = [0.8, 0.2];
        const bots = this.parseInput();
        /** @type { Map<number, { ints: Set<number> }> } */
        const dataSet = new Map([...Array(bots.length)].map((_, i) => [i, { ints: new Set() }]));
        for (const [i, a] of bots.entries()) {
            for (const [j, b] of bots.entries()) {
                if (this.hasIntersection(a, b)) {
                    dataSet.get(i).ints.add(j);
                }
            }
        }

        let maxCount = Number.NEGATIVE_INFINITY;
        for (const [keyA, record] of dataSet.entries()) {
            this.progress(keyA * p1Weight, bots.length);
            const setA = record.ints;
            let currentCount = Number.POSITIVE_INFINITY;
            for (const keyB of setA) {
                const setB = dataSet.get(keyB).ints;
                const intersection = this.intersect(setA, setB);
                currentCount = Math.min(intersection.length, currentCount);
                if (currentCount < maxCount) { break; }
            }
            record.count = currentCount;
            if (currentCount > maxCount) {
                maxCount = currentCount;
            }
        }

        const descending = [...dataSet.entries()].sort((a, b) => b[1].count - a[1].count);
        const maxCommonStuff = descending[0][1].count;
        const filteredKeys = descending.filter(x => x[1].count === maxCommonStuff).map(x => x[0]);
        const keysRadiusAscending = filteredKeys.sort((a, b) => bots[a].r - bots[b].r);
        const smallestIdx = keysRadiusAscending[0];
        const smallest = bots[smallestIdx];

        const region = this.getRegion(smallest);
        for (const keyB of dataSet.get(smallestIdx).ints) {
            const otherRegion = this.getRegion(bots[keyB]);
            this.mergeRegions(region, otherRegion);
        }

        let maxC = 0;
        const targets = [...dataSet.get(smallestIdx).ints];
        const pos = { ...smallest, r: 0 };
        while (true) {
            let c = 0; let target;
            const delta = Math.floor(Math.random() * targets.length);
            for (let i = 0; i < targets.length; i++) {
                const targetKey = (i + delta) % targets.length;
                const botKey = targets[targetKey];
                if (!this.hasIntersection(pos, bots[botKey])) {
                    target = bots[botKey];
                    break;
                }
                c++;
            }
            if (target !== undefined) {
                this.step(pos, target);
            }
            if (c > maxC) {
                this.progress(maxCommonStuff * p1Weight + maxC * p2Weight, maxCommonStuff);
                maxC = c;
                if (maxC === maxCommonStuff) {
                    break;
                }
            }
        }

        // TODO step towards {0,0,0} if needed...
        // const params = [...'xyz'];
        // const dir = {
        //     x: (pos.x > 0 ? -1 : 1),
        //     y: (pos.y > 0 ? -1 : 1),
        //     z: (pos.z > 0 ? -1 : 1),
        // };
        // let pos2 = { ...pos };
        // const targetBots = targets.map(t => bots[t]);
        // let isValid = true;
        // while (isValid) {
        //     for (const param of params) {
        //         isValid = true;
        //         const nextP = { ...pos2 };
        //         nextP[param] += dir.param;
        //         for (const bot of targetBots) {
        //             if (!this.hasIntersection(nextP, bot)) {
        //                 isValid = false; break;
        //             }
        //         }
        //         if (isValid) {
        //             pos2 = nextP;
        //             break;
        //         }
        //     }
        // }

        return this.manhattan({ x: 0, y: 0, z: 0, r: 0 }, pos);
    }

    step(pos, target) {
        const stepFactor = 1000000;
        for (const p of ['x', 'y', 'z']) {
            let delta = target[p] - pos[p];
            const delta2 = Math.ceil(delta / stepFactor);
            if (delta2 === 0 && delta !== 0) {
                delta = delta < 0 ? -1 : 1;
            } else {
                delta = delta2;
            }
            // eslint-disable-next-line no-param-reassign
            pos[p] += delta;
        }
    }

    mergeRegions(regionIn, otherRegion) {
        const region = regionIn;
        region.left = Math.max(region.left, otherRegion.left);
        region.right = Math.min(region.right, otherRegion.right);
        region.top = Math.max(region.top, otherRegion.top);
        region.bottom = Math.min(region.bottom, otherRegion.bottom);
        region.front = Math.max(region.front, otherRegion.front);
        region.back = Math.min(region.back, otherRegion.back);

        return region;
    }

    getRegion(bot) {
        const region = {
            left: bot.x - bot.r,
            right: bot.x + bot.r,
            top: bot.y - bot.r,
            bottom: bot.y + bot.r,
            front: bot.z - bot.r,
            back: bot.z + bot.r,
        };

        return region;
    }

    getRegionSize(region) {
        return (region.right - region.left + 1) * (region.bottom - region.top + 1) * (region.back - region.front + 1);
    }

    intersect(iterableA, setB) {
        const result = [];
        for (const item of iterableA) {
            if (setB.has(item)) {
                result.push(item);
            }
        }
        return result;
    }

    hasIntersection(a, b) {
        return this.manhattan(a, b) <= a.r + b.r;
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
