/* eslint-disable no-param-reassign */
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day11');
const primeFactors = require('quick-primefactors');
const Solution = require('../fw/solution');

class Day11 extends Solution {
    constructor() { super(11, 'Chronal Charge'); }

    part1() {
        const gridSize = 300;
        const serial = parseInt(this.input[0], 10);

        const grid = this.createGrid(gridSize, serial);
        const { x, y } = this.getMaxSum(grid, gridSize, 3);

        return `${x},${y}`;
    }

    part2() {
        const cache = {};
        const gridSize = 300;
        const serial = parseInt(this.input[0], 10);
        const grid = this.createGrid(gridSize, serial);

        let max = { sum: Number.NEGATIVE_INFINITY };
        for (let size = 1; size <= gridSize; size++) {
            this.progress(size, gridSize, 1);
            const temp = this.getMaxSum(grid, gridSize, size, cache);
            if (temp.sum > max.sum) {
                max = { ...temp, size };
            }
        }

        return `${max.x},${max.y},${max.size}`;
    }

    getMaxSum(grid, gridSize, size, cache = undefined) {
        if (cache) { cache[size] = {}; }
        const factor = primeFactors(size)[0] || size;
        const partSize = factor !== size ? size / factor : size;
        const sumFunc = cache ? this.getCachedSum : this.getSum;

        let maxSum = Number.NEGATIVE_INFINITY;
        let maxX; let maxY;
        for (let x = 1; x <= gridSize - size; x++) {
            for (let y = 1; y <= gridSize - size; y++) {
                const sum = sumFunc.apply(this, [grid, size, x, y, cache, partSize]);
                if (sum > maxSum) {
                    maxSum = sum;
                    maxX = x;
                    maxY = y;
                }
            }
        }
        return { sum: maxSum, x: maxX, y: maxY };
    }

    getSum(grid, size, sx, sy) {
        let sum = 0;
        for (let x = sx; x < sx + size; x++) {
            for (let y = sy; y < sy + size; y++) {
                sum += grid[x][y];
            }
        }
        return sum;
    }

    getCachedSum(grid, size, sx, sy, cache, partSize) {
        const key = this.getKey(sx, sy);
        let sum = 0;

        if (partSize < size) {
            const c = cache[partSize];
            for (let a = 0; a < size; a += partSize) {
                for (let b = 0; b < size; b += partSize) {
                    sum += c[this.getKey(sx + a, sy + b)];
                }
            }
        } else {
            sum = size > 1 ? cache[size - 1][key] : 0;
            const yf = sy + size - 1;
            for (let x = sx; x < sx + size; x++) {
                sum += grid[x][yf];
            }
            const xf = sx + size - 1;
            for (let y = sy; y < sy + size - 1; y++) {
                sum += grid[xf][y];
            }
        }

        cache[size][key] = sum;
        return sum;
    }

    getKey(x, y) {
        return 1000 * x + y;
    }

    createGrid(size, serial) {
        const grid = [];
        for (let x = 1; x <= size; x++) {
            const line = [];
            grid[x] = line;
            for (let y = 1; y <= size; y++) {
                const rackId = x + 10;
                let power = (rackId * y + serial) * rackId;
                power = Math.floor(power / 100) - (Math.floor(power / 1000) * 10) - 5;
                line[y] = power;
            }
        }
        return grid;
    }

    // getCachedSumWithoutFactors(grid, size, sx, sy, cache) {
    //     const key = this.getKey(sx, sy);
    //     let sum = size > 1 ? cache[size - 1][key] : 0;

    //     const yf = sy + size - 1;
    //     for (let x = sx; x < sx + size; x++) {
    //         sum += grid[x][yf];
    //     }
    //     const xf = sx + size - 1;
    //     for (let y = sy; y < sy + size - 2; y++) {
    //         sum += grid[xf][y];
    //     }

    //     cache[size][key] = sum;

    //     return sum;
    // }
}

module.exports = Day11;
