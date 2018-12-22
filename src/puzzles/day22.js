// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day22');
const Queue = require('queue-fifo');
const Solution = require('../fw/solution');

const MAXSIZE = 1000000;

/** Converts back and forth between [x, y] and [p] type coordinates.
 * @param { number } p
 * @param { number } y
 * @return { number } p
 * @return { {x: number, y: number} } { x, y } */
function getPos(p, y = undefined) {
    if (y === undefined) {
        const y2 = Math.floor(p / MAXSIZE);
        return { x: p - y2 * MAXSIZE, y: y2 };
    }
    return y * MAXSIZE + p;
}

const [UP, RIGHT, DOWN, LEFT] = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(p => getPos(...p));
const DIRECTIONS = [UP, RIGHT, DOWN, LEFT];

class Day22 extends Solution {
    constructor() { super(22, 'Mode Maze'); }

    part1() {
        const cave = this.parseInput();
        const levels = this.getLevels(cave);

        let risk = 0;
        for (let y = 0; y <= cave.ty; y++) {
            for (let x = 0; x <= cave.tx; x++) {
                risk += levels.get(getPos(x, y)) % 3;
            }
        }

        return risk;
    }

    part2() {
        const cave = this.parseInput();
        const levels = this.getLevels(cave);
        const result = this.flood(cave, levels);

        return result.dist;
    }

    flood(cave, levels, savePath = false) {
        const distsByType = [new Map(), new Map(), new Map()];
        const first = { pos: 0, dist: 0, tool: 0, path: [0] };
        let queue = new Queue(); queue.enqueue(first);
        const extraQueues = new Map();
        let result;

        while (!queue.isEmpty()) {
            if (extraQueues.has(queue.peek().dist)) {
                queue = this.switchQueuesIfNeeded(queue, extraQueues, true);
            }

            const e = queue.dequeue();
            if (distsByType[e.tool].has(e.pos)) {
                queue = this.switchQueuesIfNeeded(queue, extraQueues);
                continue;
            }
            distsByType[e.tool].set(e.pos, e.dist);
            if (e.pos === cave.target) { result = e; break; }

            const { x, y } = getPos(e.pos);
            const level = this.getLevel(levels, cave, e.pos);
            for (const direction of DIRECTIONS) {
                if ((x === 0 && direction === LEFT) || (y === 0 && direction === UP)) { continue; }
                const nextPos = e.pos + direction;
                const nextLevel = this.getLevel(levels, cave, nextPos);
                const nextPath = savePath ? [...e.path, nextPos] : e.path;
                let nextDist = e.dist + 1;

                if (this.isCompatible(e.tool, nextLevel) && !(nextPos === cave.target && e.tool !== 0)) {
                    if (!distsByType[e.tool].has(nextPos)) {
                        queue.enqueue({ pos: nextPos, dist: nextDist, tool: e.tool, path: nextPath });
                    }
                } else {
                    const nextTool = this.getCompatibleTool(level, nextLevel);
                    if (!distsByType[nextTool].has(nextPos)) {
                        nextDist += 7;
                        if (!extraQueues.has(nextDist)) { extraQueues.set(nextDist, new Queue()); }
                        extraQueues.get(nextDist).enqueue({
                            pos: nextPos, dist: nextDist, tool: nextTool, path: nextPath
                        });
                    }
                }
            }

            queue = this.switchQueuesIfNeeded(queue, extraQueues);
        }

        return result;
    }

    switchQueuesIfNeeded(queue, extraQueues, forceSwitch = false) {
        if (forceSwitch || (queue.isEmpty() && extraQueues.size > 0)) {
            const key = extraQueues.keys().next().value;
            const nextQueue = extraQueues.get(key);
            while (!queue.isEmpty()) { nextQueue.enqueue(queue.dequeue()); }
            extraQueues.delete(key);
            // eslint-disable-next-line no-param-reassign
            queue = nextQueue;
        }
        return queue;
    }

    isCompatible(tool, level) {
        const tool2 = level % 3;
        return (tool === tool2) || (tool === ((tool2 + 1) % 3));
    }

    getCompatibleTool(level1, level2) {
        // 0: 0 1
        // 1:   1 2
        // 2: 0   2
        let t1 = level1 % 3;
        let t2 = level2 % 3;
        if (t1 > t2) {
            const temp = t1;
            t1 = t2;
            t2 = temp;
        }
        if (t1 === 0) {
            if (t2 === 1) { return 1; }
            if (t2 === 2) { return 0; }
        }
        return 2;
    }

    getLevels(cave) {
        const { tx, ty } = cave;
        const levels = new Map();
        for (let y = 0; y <= ty; y++) {
            for (let x = 0; x <= tx; x++) {
                this.getLevel(levels, cave, getPos(x, y));
            }
        }

        return levels;
    }

    getLevel(levels, cave, pos) {
        let level = levels.get(pos);
        if (level !== undefined) { return level; }

        const { x, y } = getPos(pos);
        const { depth, tx, ty } = cave;

        let gIndex;
        if ((x === 0 && y === 0) || (x === tx && y === ty)) {
            gIndex = 0;
        } else if (y === 0) {
            gIndex = x * 16807;
        } else if (x === 0) {
            gIndex = y * 48271;
        } else {
            gIndex = this.getLevel(levels, cave, pos + LEFT)
                * this.getLevel(levels, cave, pos + UP);
        }
        level = (gIndex + depth) % 20183;
        levels.set(pos, level);

        return level;
    }

    visualize(levels, tx, ty, path = []) {
        // eslint-disable-next-line no-param-reassign
        path = new Set(path);
        const chars = ['.', '=', '|'];
        const lines = [];
        for (let y = 0; y <= ty; y++) {
            const line = [];
            for (let x = 0; x <= tx; x++) {
                const char = chars[levels.get(getPos(x, y)) % 3];
                if (path.has(getPos(x, y))) {
                    line.push('X');
                } else {
                    line.push(char);
                }
            }
            lines.push(line.join(''));
        }
        this.frame(lines);
    }

    parseInput() {
        const [, depth] = /.* ([0-9]+)/.exec(this.input[0]).map(Number);
        const [, tx, ty] = /.* ([0-9]+),([0-9]+)/.exec(this.input[1]).map(Number);
        return { depth, tx, ty, target: getPos(tx, ty) };
    }
}

module.exports = Day22;
