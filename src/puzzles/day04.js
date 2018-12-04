// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day04');
const Solution = require('../fw/solution');

class Day04 extends Solution {
    constructor() { super(4, 'Repose Record'); }

    part1() {
        /** @type { Map<string, { id: string, sleepSum: number, records: Array<{id: String, date: Date, isAwake: Boolean}>> } */
        const guards = this.getRecords().reduce((map, r) => {
            if (!map.has(r.id)) { map.set(r.id, { id: r.id, records: [] }); }
            map.get(r.id).records.push(r);
            return map;
        }, new Map());
        debug(guards);

        for (const [id, guard] of guards) {
            let sum = 0;
            let lastDate = guard.records[0].date;
            debug(id);
            for (const record of guard.records) {
                if (!record.isAwake) {
                    const diff = (record.date - lastDate) / 60000; // ms => min
                    sum += diff;
                    debug(diff);
                }
                lastDate = record.date;
            }
            guard.sleepSum = sum;
        }

        const guard = Array.from(guards.values()).reduce((acc, x) => (x.sleepSum > acc.sleepSum ? x : acc),
            guards.values().next().value);
        return `${guard.id}: ${guard.sleepSum} - ${parseInt(guard.id, 10) * guard.sleepSum}`;
    }

    part2() {

    }

    getRecords() {
        const records = [];
        for (const line of this.input) {
            const [, dateStr] = /\[([0-9\- :]+)\]/g.exec(line);
            const date = new Date(`${dateStr.split(' ').join('T')}:00`);

            let id;
            let isAwake = true;
            if (line.indexOf('Guard') !== -1) {
                [, id] = /.*#([0-9]+)/.exec(line);
            } else if (line.indexOf('asleep') === -1) {
                isAwake = false;
            }

            records.push({
                date, id, isAwake
            });
        }

        // Fill missing ids
        records.sort((a, b) => a.date - b.date);
        let currentId;
        for (const record of records) {
            if (record.id !== undefined) {
                currentId = record.id;
            } else {
                record.id = currentId;
            }
        }

        return records;
    }
}

module.exports = Day04;
