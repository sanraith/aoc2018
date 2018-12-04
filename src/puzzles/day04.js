/* eslint-disable no-continue */
/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day04');
const Solution = require('../fw/solution');

class Day04 extends Solution {
    constructor() { super(4, 'Repose Record'); }

    part1() {
        const guard = Array.from(this.getGuards().values()).reduce((acc, g) => (!acc || g.sleepSum > acc.sleepSum ? g : acc));
        const timeSlot = guard.sleeps.reduce((acc, s) => (s.count > acc.count ? s : acc), guard.sleeps[0]);
        const result = parseInt(guard.id, 10) * timeSlot.start.getMinutes();
        debug(`Guard #${guard.id} Sum: ${guard.sleepSum} Time:${timeSlot.start.getMinutes()} Result: ${result}`);

        return result;
    }

    part2() {
        let selected;
        for (const guard of this.getGuards().values()) {
            if (guard.sleeps.length === 0) { continue; }
            guard.bestSleep = guard.sleeps.reduce((max, s) => (!max || s.count > max.count ? s : max));

            if (!selected || guard.bestSleep.count > selected.bestSleep.count) {
                selected = guard;
            }
        }

        const result = parseInt(selected.id, 10) * selected.bestSleep.start.getMinutes();
        debug(`Guard #${selected.id} Count: ${selected.bestSleep.count} Time: ${selected.bestSleep.start.getMinutes()} Result: ${result}`);

        return result;
    }

    getGuards() {
        /** @type { Map<string, { id: string, sleepSum: number, sleeps:Array<{start: Date, end: Date, durationMin: Number, count: Number}>, records: Array<{id: String, date: Date, isAwake: Boolean}>> } */
        const guards = this.getRecords().reduce((map, r) => {
            if (!map.has(r.id)) {
                map.set(r.id, {
                    id: r.id, sleepSum: 0, sleeps: [], records: []
                });
            }
            map.get(r.id).records.push(r);
            return map;
        }, new Map());

        for (const [, guard] of guards) {
            let lastDate = guard.records[0].date;
            for (const [index, record] of guard.records.entries()) {
                const prevRecord = guard.records[index - 1];
                if (index !== 0 && record.isAwake && !prevRecord.isAwake) {
                    guard.sleepSum += (record.date - lastDate) / 60000; // ms => min
                    guard.sleeps.push({
                        start: this.normalizeDate(prevRecord.date),
                        end: this.normalizeDate(record.date)
                    });
                }
                lastDate = record.date;
            }

            for (const sleep of guard.sleeps) {
                const d = sleep.start;
                sleep.count = guard.sleeps.reduce((acc, x) => acc + (d >= x.start && d < x.end), 0);
            }
        }

        return guards;
    }

    /**
     * @param { Date } date
     */
    normalizeDate(date) {
        return new Date(0, 0, 0, date.getHours(), date.getMinutes());
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
            } else if (line.indexOf('asleep') !== -1) {
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
