// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day11');
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
        const gridSize = 300;
        const serial = parseInt(this.input[0], 10);
        const grid = this.createGrid(gridSize, serial);

        let max = { sum: Number.NEGATIVE_INFINITY };
        for (let size = 1; size <= gridSize; size++) {
            this.progress(size, gridSize, 1);
            const temp = this.getMaxSum(grid, gridSize, size);
            if (temp.sum > max.sum) {
                max = { ...temp, size };
            }
        }

        return `${max.x},${max.y},${max.size}`;
    }

    getMaxSum(grid, gridSize, size) {
        let maxSum = Number.NEGATIVE_INFINITY;
        let maxX; let maxY;
        for (let x = 1; x <= gridSize - size; x++) {
            for (let y = 1; y <= gridSize - size; y++) {
                const sum = this.getSum(grid, size, x, y);
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
}

module.exports = Day11;
