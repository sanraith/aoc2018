// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day07');
const Solution = require('../fw/solution');

class Day07 extends Solution {
    constructor() { super(7, 'The Sum of Its Parts'); }

    part1() {
        const map = this.parseInput();
        const result = [];

        const queue = Array.from(map.keys()).filter(id => map.get(id).before.size === 0);
        while (queue.length > 0) {
            queue.sort();
            const nextWork = this.pickNextWork(map, queue);
            result.push(nextWork.id);
            this.finishWork(map, queue, nextWork.id);
        }

        return result.join('');
    }

    part2() {
        const elfCount = 5;
        const map = this.parseInput();
        const result = [];
        const queue = Array.from(map.keys()).filter(id => map.get(id).before.size === 0);
        /** @type { Array<{id: Number, work: String, remaining: number}> } */
        const elves = [...Array(elfCount)].map((_, i) => ({
            id: i,
            work: null,
            remaining: 0
        }));

        let [totalTime, elapsedTime] = [0, 0];
        while (queue.length > 0 || elapsedTime > 0) {
            // save finished work, queue new work
            const sortedFinished = elves.filter(e => e.work && !e.remaining)
                .sort((a, b) => a.work.localeCompare(b.work));
            for (const elf of sortedFinished) {
                result.push(elf.work);
                this.finishWork(map, queue, elf.work);
                elf.work = null;
            }

            // distribute work
            queue.sort();
            for (const elf of elves.filter(e => !e.work)) {
                const nextWork = this.pickNextWork(map, queue);
                if (!nextWork) { break; } // no more work available
                elf.work = nextWork.id;
                elf.remaining = nextWork.time;
            }

            // progress work
            const time = elves.reduce((t, e) => Math.min(t, e.remaining > 0 ? e.remaining : t), Number.POSITIVE_INFINITY);
            elves.forEach(e => (e.remaining -= time));
            elapsedTime = time === Number.POSITIVE_INFINITY ? 0 : time;
            totalTime += elapsedTime;
        }

        return totalTime;
    }

    pickNextWork(map, queue) {
        let selected;
        for (const [index, id] of queue.entries()) {
            const item = map.get(id);
            if (item.before.size === 0) {
                queue.splice(index, 1);
                selected = item;
                break;
            }
        }
        return selected;
    }

    finishWork(map, queue, finishedId) {
        for (const nextId of map.get(finishedId).after) {
            map.get(nextId).before.delete(finishedId);
            if (!queue.includes(nextId)) {
                queue.push(nextId);
            }
        }
    }

    parseInput() {
        /** @type {Map<string, {id: string, time: number, before: Set<string>, after: Set<string>>} */
        const map = new Map();
        for (const line of this.input) {
            const [, from, to] = /Step ([A-Z]) must be finished before step ([A-Z]) can begin\./.exec(line);
            for (const id of [from, to]) {
                if (!map.has(id)) {
                    map.set(id, {
                        id,
                        time: id.charCodeAt(0) - 4,
                        before: new Set(),
                        after: new Set()
                    });
                }
            }
            map.get(from).after.add(to);
            map.get(to).before.add(from);
        }
        return map;
    }
}

module.exports = Day07;
