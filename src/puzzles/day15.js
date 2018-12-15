/* eslint-disable no-cond-assign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day15');
const Queue = require('queue-fifo');
const Solution = require('../fw/solution');

class Day15 extends Solution {
    constructor() { super(15, 'Beverage Bandits'); }

    part1() {
        return this.combat().outcome;
    }

    part2() {
        let result;
        let power = 4;
        while ((result = this.combat(true, power)).losses > 0) {
            power++;
        }

        return result.outcome;
    }

    combat(breakOnLoss = false, power = 3) {
        const { walls, entities, goblins, elves } = this.parseInput(power);
        let round = 0;
        let wasFullRound;
        const elvesTotal = elves.length;
        while (goblins.length > 0 && elves.length > 0) {
            round++;
            wasFullRound = this.singleRound(walls, entities, goblins, elves);
            if (breakOnLoss && elves.length < elvesTotal) { break; }
        }
        round -= wasFullRound ? 0 : 1;
        const hitPoints = entities.reduce((acc, e) => acc + e.hp, 0);

        return { outcome: round * hitPoints, losses: elvesTotal - elves.length };
    }

    /**
     * @param { Set<number> } walls
     * @param { Array<any> } entities
     * @param { Array<any> } goblins
     * @param { Array<any> } elves
     */
    singleRound(walls, entities, goblins, elves) {
        entities.sort((a, b) => a.pos - b.pos);
        for (const entity of entities.slice()) {
            if (entity.hp <= 0) { continue; }

            const enemies = goblins.includes(entity) ? elves : goblins;
            if (enemies.length === 0) { return false; }

            let target = this.getTarget(entity, enemies);
            if (!target) {
                const moveTargets = new Set(enemies
                    .reduce((acc, e) => acc.concat(this.readingOrder.map(d => e.pos + d)), []));
                const { path } = this.findTargetPath(entity.pos, walls, moveTargets);
                if (path) {
                    walls.delete(entity.pos);
                    entity.pos = path[0];
                    walls.add(entity.pos);
                }
            }

            target = target || this.getTarget(entity, enemies);
            if (target) {
                target.hp -= entity.ap;
                if (target.hp <= 0) {
                    walls.delete(target.pos);
                    enemies.splice(enemies.indexOf(target), 1);
                    entities.splice(entities.indexOf(target), 1);
                }
            }
        }
        // this.visualize(walls, goblins, elves);

        return true;
    }

    getTarget(entity, enemies) {
        const targets = this.readingOrder
            .map(d => enemies.find(e => e.pos === (entity.pos + d)))
            .filter(e => e)
            .sort((a, b) => a.hp - b.hp);
        return targets[0];
    }

    visualize(walls, goblins, elves, pos = -1, path = [], visited = new Set()) {
        for (let y = 0; y < this.input.length; y++) {
            const line = [];
            for (let x = 0; x < this.mapWidth; x++) {
                const c = this.coord(x, y);
                if (c === pos) {
                    line.push('X');
                } else if (path.includes(c)) {
                    line.push(visited.get(c));
                } else if (goblins.find(g => g.pos === c)) {
                    line.push('G');
                } else if (elves.find(g => g.pos === c)) {
                    line.push('E');
                } else if (walls.has(c)) {
                    line.push('#');
                } else {
                    line.push('.');
                }
            }
            debug(line.join(''));
        }
    }

    /**
     * @param { number } x
     * @param { number } y
     * @param { Set<number> } walls
     * @param { Set<number> } targets
     * @returns { {pos: number, dist: number, path: Array<number>, visited: Map<number, number>} }
     */
    findTargetPath(start, walls, targets) {
        const visited = new Map(); visited.set(start, 0);
        const queue = new Queue(); queue.enqueue({ pos: start, dist: 0, path: [] });

        while (!queue.isEmpty()) {
            const { pos, dist, path } = queue.dequeue();
            for (const delta of this.readingOrder) {
                const nextPos = pos + delta;
                const next = { pos: nextPos, dist: dist + 1, path: [...path, nextPos] };
                if (targets.has(nextPos) && !walls.has(nextPos)) {
                    return { ...next, visited };
                }
                if (!walls.has(nextPos) && !visited.has(nextPos)) {
                    visited.set(nextPos, dist + 1);
                    queue.enqueue(next);
                }
            }
        }

        return { dist: 0, visited };
    }

    coord(x, y) {
        return this.mapWidth * y + x;
    }

    parseInput(power) {
        const [elves, goblins, entities] = [[], [], []];
        const walls = new Set();
        this.mapWidth = this.input.reduce((acc, l) => l.length > acc ? l.length : acc, 0);
        this.readingOrder = [this.coord(0, -1), this.coord(-1, 0), this.coord(1, 0), this.coord(0, 1)];

        for (const [y, line] of this.input.entries()) {
            for (const [x, c] of [...line].entries()) {
                const pos = this.coord(x, y);
                const entity = { pos, hp: 200, ap: 3 };
                walls.add(pos);
                switch (c) {
                    case 'E': entity.ap = power; elves.push(entity); entities.push(entity); break;
                    case 'G': goblins.push(entity); entities.push(entity); break;
                    case '#': break;
                    case '.': walls.delete(pos); break;
                    default: throw Error('Unknown character in input!');
                }
            }
        }
        return { entities, elves, goblins, walls };
    }
}

module.exports = Day15;
