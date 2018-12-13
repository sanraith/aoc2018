/* eslint-disable no-continue */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day13');
const Solution = require('../fw/solution');

const EMPTIES = new Set([' ', undefined]);
const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
const CARTS = ['^', '>', 'v', '<'];
const DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const TRANSITIONS = new Map([
    ['|', [UP, null, DOWN, null]],
    ['-', [null, RIGHT, null, LEFT]],
    ['+', [UP, RIGHT, DOWN, LEFT]],
    ['/', [RIGHT, UP, LEFT, DOWN]],
    ['\\', [LEFT, DOWN, RIGHT, UP]]
]);

class Day13 extends Solution {
    constructor() { super(13, 'Mine Cart Madness'); }

    part1() {
        const { map, carts } = this.parseInput();

        let collision;
        // eslint-disable-next-line no-cond-assign, no-empty
        while (!(collision = this.step(map, carts))) { }

        return `${collision.a.x},${collision.a.y}`;
    }

    part2() {
        const { map, carts } = this.parseInput();

        while (carts.length !== 1) {
            this.step(map, carts, true);
        }

        return `${carts[0].x},${carts[0].y}`;
    }

    /**
     * @param { Array<Array<string>>} map
     * @param { Array<{x: number, y: number, direction: number}>} carts
     */
    step(map, carts, shouldRemove = false) {
        carts.sort((a, b) => (a.y - b.y) * 10000 + (a.x - b.x));
        for (const cart of carts.slice(0)) {
            const delta = DIRECTIONS[cart.direction];
            cart.x += delta[0];
            cart.y += delta[1];
            const track = map[cart.y][cart.x];
            if (track === '+') {
                cart.direction = TRANSITIONS.get(track)[(cart.direction + cart.memory + 3) % 4];
                cart.memory = (cart.memory + 1) % 3;
            } else {
                cart.direction = TRANSITIONS.get(track)[cart.direction];
            }

            let collision;
            // eslint-disable-next-line no-cond-assign
            if ((collision = this.collision(carts))) {
                if (shouldRemove) {
                    carts.splice(carts.findIndex(c => c === collision.a), 1);
                    carts.splice(carts.findIndex(c => c === collision.b), 1);
                } else {
                    return collision;
                }
            }
        }
        return undefined;
    }

    collision(carts) {
        for (let i = 0; i < carts.length; i++) {
            for (let j = i + 1; j < carts.length; j++) {
                if (carts[i].x === carts[j].x && carts[i].y === carts[j].y) {
                    return { a: carts[i], b: carts[j] };
                }
            }
        }
        return null;
    }

    parseInput() {
        const map = [];
        for (const line of this.input) {
            map.push([...line]);
        }
        const width = map.reduce((acc, l) => l.length > acc ? l.length : acc, 0);
        const height = map.length;

        const carts = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = map[y][x];
                if (EMPTIES.has(tile)) { continue; }
                if (CARTS.includes(tile)) {
                    const direction = CARTS.indexOf(tile);
                    const track = Array.from(TRANSITIONS.keys())[Array.from(TRANSITIONS.values())
                        .findIndex(v => v.includes(direction))];
                    map[y][x] = track;
                    carts.push({
                        x, y, direction, memory: 0
                    });
                }
            }
        }

        return { map, carts };
    }
}

module.exports = Day13;
