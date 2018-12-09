// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day09');
const Solution = require('../fw/solution');

class Day09 extends Solution {
    constructor() { super(9, 'Marble Mania'); }

    part1() {
        let { playerCount, lastMarble } = this.parseInput();
        const circle = [0];
        const players = new Map();
        let current = 1;
        let index = 0;
        let playerIndex = 0;

        // playerCount = 13;
        // lastMarble = 7999;
        while (current <= lastMarble) {
            if (current % 23 === 0) {
                index = (7 * circle.length + index - 7) % circle.length;
                const extraPoint = circle[index];
                circle.splice(index, 1);
                if (!players.has(playerIndex)) { players.set(playerIndex, 0); }
                players.set(playerIndex, players.get(playerIndex) + current + extraPoint);
            } else {
                index = ((index + 1) % circle.length) + 1;
                circle.splice(index, 0, current);
            }
            current++;
            playerIndex = (playerIndex + 1) % playerCount;
        }

        const highest = Array.from(players.values()).reduce((acc, x) => x > acc ? x : acc, 0);
        return highest;
    }

    part2() {
        let { playerCount, lastMarble } = this.parseInput();
        const circle = [0];
        const players = new Map();
        let current = 1;
        let index = 0;
        let playerIndex = 0;

        // playerCount = 13;
        lastMarble *= 100;
        while (current <= lastMarble) {
            this.progress(current, lastMarble);
            if (current % 23 === 0) {
                index = (7 * circle.length + index - 7) % circle.length;
                const extraPoint = circle[index];
                circle.splice(index, 1);
                if (!players.has(playerIndex)) { players.set(playerIndex, 0); }
                players.set(playerIndex, players.get(playerIndex) + current + extraPoint);
            } else {
                index = ((index + 1) % circle.length) + 1;
                circle.splice(index, 0, current);
            }
            current++;
            playerIndex = (playerIndex + 1) % playerCount;
        }

        const highest = Array.from(players.values()).reduce((acc, x) => x > acc ? x : acc, 0);
        return highest;
    }

    parseInput() {
        const [, playerCount, lastMarble] = /([0-9]+) players.+ ([0-9]+) points/.exec(this.input[0]).map(Number);
        return { playerCount, lastMarble };
    }
}

module.exports = Day09;
