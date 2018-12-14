// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day14');
const Solution = require('../fw/solution');

class Day14 extends Solution {
    constructor() { super(14, 'Chocolate Charts'); }

    part1() {
        const failedTries = parseInt(this.input[0], 10);
        const recipes = [3, 7];
        const indexes = [0, 1];
        const resultLength = 10;

        while (recipes.length < failedTries + resultLength) {
            const digits = this.getDigits(recipes, indexes);
            for (const digit of digits) {
                recipes.push(digit);
            }
            for (let j = 0; j < 2; j++) {
                indexes[j] = (indexes[j] + recipes[indexes[j]] + 1) % recipes.length;
            }
        }

        return recipes.slice(failedTries, failedTries + resultLength).join('');
    }

    part2() {
        const target = [...this.input[0]].map(x => parseInt(x, 10));
        const targetLength = target.length;
        const recipes = [3, 7];
        const indexes = [0, 1];

        let result;
        while (!result) {
            const digits = this.getDigits(recipes, indexes);
            for (const digit of digits) {
                recipes.push(digit);
                if (this.check(recipes, target, targetLength)) {
                    result = recipes.length - target.length;
                    break;
                }
            }
            for (let j = 0; j < 2; j++) {
                indexes[j] = (indexes[j] + recipes[indexes[j]] + 1) % recipes.length;
            }
        }

        return result;
    }

    getDigits(recipes, indexes) {
        const recipe = recipes[indexes[0]] + recipes[indexes[1]];
        const digit10 = Math.floor(recipe / 10);
        const digit1 = recipe - digit10 * 10;
        if (digit10 > 0) {
            return [digit10, digit1];
        }
        return [digit1];
    }

    check(recipes, target, targetLength) {
        let ri = recipes.length - targetLength;
        for (const number of target) {
            if (number !== recipes[ri++]) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Day14;
