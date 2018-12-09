// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day09');
const Solution = require('../fw/solution');

class Linked {
    /**
     * @param { any } value
     * @param { Linked } head
     * @param { Linked } tail
     */
    constructor(value, head = this, tail = this) {
        this.head = head;
        this.tail = tail;
        this.value = value;
    }

    delete() {
        this.head.tail = this.tail;
        this.tail.head = this.head;
        return this.tail;
    }

    insert(value) {
        const link = new Linked(value, this.head, this);
        this.head.tail = link;
        this.head = link;
        return link;
    }

    /** @param { Number } steps */
    step(steps) {
        const isForward = steps > 0;
        let remaining = Math.abs(steps);
        let current = this;
        while (remaining > 0) {
            current = isForward ? current.tail : current.head;
            remaining--;
        }
        return current;
    }

    values() {
        let current = this;
        const values = [];
        do {
            values.push(current.value);
            current = current.tail;
        } while (current !== this);
        return values;
    }
}

class Day09 extends Solution {
    constructor() { super(9, 'Marble Mania'); }

    part1() {
        const { playerCount, lastMarble } = this.parseInput();
        return this.solve(playerCount, lastMarble);
    }

    part2() {
        const { playerCount, lastMarble } = this.parseInput();
        return this.solve(playerCount, lastMarble * 100);
    }

    solve(playerCount, lastMarble) {
        const players = new Map(); for (let i = 0; i < playerCount; i++) { players.set(i, 0); }
        let circle = new Linked(0);
        let marble = 1;
        let player = 0;

        while (marble <= lastMarble) {
            if (marble % 23 === 0) {
                circle = circle.step(-7);
                players.set(player, players.get(player) + marble + circle.value);
                circle = circle.delete();
            } else {
                circle = circle.step(2);
                circle = circle.insert(marble);
            }
            marble++;
            player = (player + 1) % playerCount;
            this.progress(marble, lastMarble);
        }

        const max = Array.from(players.values()).reduce((acc, x) => x > acc ? x : acc, 0);
        return max;
    }

    parseInput() {
        const [, playerCount, lastMarble] = /([0-9]+) players.+ ([0-9]+) points/.exec(this.input[0]).map(Number);
        return { playerCount, lastMarble };
    }
}

module.exports = Day09;
