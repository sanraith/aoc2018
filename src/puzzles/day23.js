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
        // const minMaxMap = new Map([...'xyz'].map(c => [c,
        //     { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }]));
        // for (const bot of bots) {
        //     for (const prop of [...'xyz']) {
        //         const value = bot[prop];
        //         const minMax = minMaxMap.get(prop);
        //         minMax.min = Math.min(minMax.min, value);
        //         minMax.max = Math.max(minMax.max, value);
        //     }
        // }
        // debug(minMaxMap);

        /** @type { Map<number, { ints: Set<number> }> } */
        const dataSet = new Map([...Array(bots.length)].map((_, i) => [i, { ints: new Set() }]));
        for (const [i, a] of bots.entries()) {
            for (const [j, b] of bots.entries()) {
                // if (a === b) { continue; }
                if (this.hasIntersection(a, b)) {
                    dataSet.get(i).ints.add(j);
                }
            }
        }

        for (const [keyA, bot] of bots.entries()) {
            const region = this.getRegion(bot);
            for (const keyB of dataSet.get(keyA).ints) {
                const otherRegion = this.getRegion(bots[keyB]);
                this.mergeRegions(region, otherRegion);
            }

            debug(keyA, this.getRegionSize(region), region);
        }

        // let maxCount = Number.NEGATIVE_INFINITY;
        // for (const [keyA, record] of dataSet.entries()) {
        //     this.progress(keyA, bots.length);

        //     const setA = record.ints;
        //     let currentCount = Number.POSITIVE_INFINITY;
        //     for (const keyB of setA) {
        //         const setB = dataSet.get(keyB).ints;
        //         const intersection = this.intersect(setA, setB);
        //         currentCount = Math.min(intersection.length, currentCount);
        //         if (currentCount < maxCount) { break; }
        //     }
        //     record.count = currentCount;
        //     if (currentCount > maxCount) {
        //         // debug(keyA, record.ints.size, currentCount);
        //         maxCount = currentCount;
        //     }
        // }

        // const descending = [...dataSet.entries()].sort((a, b) => b[1].count - a[1].count);
        // const maxCommonStuff = descending[0][1].count;
        // const filteredKeys = descending.filter(x => x[1].count === maxCommonStuff).map(x => x[0]);
        // // for (const key of filteredKeys) {
        // //     debug(key, dataSet.get(key).ints.size);
        // // }

        // const keysRadiusAscending = filteredKeys.sort((a, b) => bots[a].r - bots[b].r);
        // debug('Candidate count', keysRadiusAscending.length);
        // debug('Smallest:', keysRadiusAscending[0], bots[keysRadiusAscending[0]]);

        // const smallestIdx = keysRadiusAscending[0];
        // const smallest = bots[smallestIdx];
        // const region = this.getRegion(smallest);
        // debug('Region before:', this.getRegionSize(region), region);

        // // Get points contributing to the target intersection
        // let contributingIndexes;
        // const setA = dataSet.get(smallestIdx).ints;
        // for (const keyB of setA) {
        //     if (contributingIndexes === undefined) { contributingIndexes = setA; }
        //     const setB = dataSet.get(keyB).ints;
        //     contributingIndexes = this.intersect(contributingIndexes, setB);
        // }

        // for (const contributingIndex of contributingIndexes) {
        //     const newRegion = this.getRegion(bots[contributingIndex]);
        //     region.left = Math.max(region.left, newRegion.left);
        //     region.right = Math.min(region.right, newRegion.right);
        //     region.top = Math.max(region.top, newRegion.top);
        //     region.bottom = Math.min(region.bottom, newRegion.bottom);
        //     region.front = Math.max(region.front, newRegion.front);
        //     region.back = Math.min(region.back, newRegion.back);
        // }
        // debug('Region after:', this.getRegionSize(region), region);

        // for (let x = region.left; x <= region.right; x++) {
        //     for (let y = region.top; y <= region.bottom; y++) {
        //         for (let z = region.front; z <= region.back; z++) {
        //             const p = { x, y, z };
        //             let count = 0;
        //             for (const idx of contributingIndexes) {
        //                 count += this.manhattan(bots[idx], p) <= bots[idx].r;
        //             }
        //             debug(p, count);
        //         }
        //     }
        // }

        return '0';
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
