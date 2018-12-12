// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day12');
const Solution = require('../fw/solution');

class Day12 extends Solution {
    constructor() { super(12, 'Subterranean Sustainability'); }

    part1() {
        // eslint-disable-next-line prefer-const
        let { state, rules } = this.parseInput();
        let { diff } = this.normalizeState(state);
        debug('.'.repeat(10 - diff) + state.join(''));

        for (let i = 1; i <= 20; i++) {
            const { a, s } = this.step(state, rules, diff);
            diff = a;
            state = s;
            debug('.'.repeat(10 - diff) + state.join(''));
        }

        return state.reduce((acc, x, i) => acc + (x === '#' ? i - diff : 0), 0);
    }


    part2() {
        // eslint-disable-next-line prefer-const
        let { state, rules } = this.parseInput();
        let { diff } = this.normalizeState(state);
        let prevState = '';
        let prevDiff = 0;
        let iter = 0;
        do {
            iter++;
            prevState = state.join('');
            prevDiff = diff;
            const { a, s } = this.step(state, rules, diff);
            diff = a; state = s;
        } while (prevState !== state.join(''));
        diff += (50000000000 - iter) * (diff - prevDiff);
        return state.reduce((acc, x, i) => acc + (x === '#' ? i - diff : 0), 0);
    }


    /**
     * @param { Array<string> } state
     * @param { Array<{from: string, to: string}> } rules
     */
    step(state, rules, diff2) {
        const stateLength = state.length;
        const nextState = ['.', '.'];
        for (let i = 2; i < stateLength - 2; i++) {
            const pattern = state.slice(i - 2, i + 3).join('');
            const value = rules.find(r => r.from === pattern);
            if (value) {
                nextState.push(value.to);
            } else {
                nextState.push('.');
            }
        }
        const { diff } = this.normalizeState(nextState);
        return { a: diff + diff2, s: nextState };
    }

    /** @param { Array<string> } state */
    normalizeState(state) {
        const maxDotCount = 5;
        let diff = 0;
        const firstPlant = state.findIndex(x => x === '#');
        if (firstPlant > maxDotCount) {
            diff = maxDotCount - firstPlant;
            state.splice(0, firstPlant - maxDotCount);
        } else {
            const extraItems = [];
            for (let i = 0; i < maxDotCount - firstPlant; i++) {
                diff++;
                extraItems.push('.');
            }
            state.splice(0, 0, ...extraItems);
        }

        const stateLength = state.length;
        const lastPlant = state.lastIndexOf('#');
        const dotCount = stateLength - lastPlant - 1;
        if (dotCount > maxDotCount) {
            state.splice(lastPlant + 1, dotCount - maxDotCount);
        } else {
            const extraItems = [];
            for (let i = 0; i < maxDotCount - dotCount; i++) {
                extraItems.push('.');
            }
            state.splice(lastPlant + 1, 0, ...extraItems);
        }
        return { diff, state };
    }

    parseInput() {
        let [, state] = /initial state: ([.#]+)/.exec(this.input[0]);
        state = [...state];

        const rules = [];
        for (const line of this.input.slice(2)) {
            const [, from, to] = /([.#]+) => ([.#])/.exec(line);
            rules.push({ fromC: from[2], from, to });
        }


        rules.sort((a, b) => a.fromC.localeCompare(b.fromC) * 10 + a.to.localeCompare(b.to));

        return { state, rules };
    }
}

module.exports = Day12;
