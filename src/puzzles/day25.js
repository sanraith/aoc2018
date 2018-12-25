// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day25');
const Solution = require('../fw/solution');

const AXISNAMES = [...'xyzt'];

class Day25 extends Solution {
    constructor() { super(25, 'Four-Dimensional Adventure'); }

    part1() {
        const points = this.parseInput();

        const constellations = [];
        for (const a of points) {
            const selected = [];
            for (const constellation of constellations) {
                for (const b of constellation) {
                    if (this.manhattan(a, b) <= 3) {
                        constellation.add(a);
                        selected.push(constellation);
                        break;
                    }
                }
            }
            if (selected.length === 0) {
                constellations.push(new Set([a]));
            } else if (selected.length > 1) {
                this.mergeConstellations(constellations, selected);
            }
        }

        return constellations.length;
    }

    part2() {
        return '*';
    }

    mergeConstellations(constellations, selectedConstellations) {
        if (selectedConstellations.length < 1) { return; }
        const main = selectedConstellations[0];
        for (const constellation of selectedConstellations) {
            if (constellation === main) { continue; }
            for (const item of constellation) {
                main.add(item);
            }
            constellations.splice(constellations.indexOf(constellation), 1);
        }
    }

    manhattan(a, b) {
        let sum = 0;
        for (const axis of AXISNAMES) {
            sum += Math.abs(a[axis] - b[axis]);
        }
        return sum;
    }

    parseInput() {
        const pattern = /([0-9-]+),([0-9-]+),([0-9-]+),([0-9-]+)/;
        const coords = [];
        for (const line of this.input) {
            const [, x, y, z, t] = pattern.exec(line).map(Number);
            coords.push({ x, y, z, t, hash: line });
        }

        return coords;
    }
}

module.exports = Day25;
