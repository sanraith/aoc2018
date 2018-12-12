// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day12');
const Solution = require('../fw/solution');

class Day12 extends Solution {
    constructor() { super(12, 'Subterranean Sustainability'); }

    part1() {
        // eslint-disable-next-line prefer-const
        let { state, rules } = this.parseInput();
        let { delta } = this.normalizeState(state);
        for (let i = 1; i <= 20; i++) {
            ({ delta, state } = this.step(state, rules, delta));
        }

        return state.reduce((acc, x, i) => acc + (x === '#' ? i - delta : 0), 0);
    }

    part2() {
        const targetIter = 50000000000;
        // eslint-disable-next-line prefer-const
        let { state, rules } = this.parseInput();
        let { delta } = this.normalizeState(state);
        /** @type { Map<string, {delta: number, iter: number}> } */
        const states = new Map();
        states.set(state.join(''), { delta, iter: 0 });

        let iter = 0;
        do {
            iter++;
            ({ delta, state } = this.step(state, rules, delta));
            const stateStr = state.join('');
            if (states.has(stateStr)) {
                const prev = states.get(stateStr);
                const dDiff = delta - prev.delta;
                const iDiff = iter - prev.iter;
                const remainingIter = targetIter - iter;
                const jumpCount = Math.floor(remainingIter / iDiff);
                delta += dDiff * jumpCount;
                iter += iDiff * jumpCount;
            }
            states.set(stateStr, { delta, iter });
        } while (iter < targetIter);

        return state.reduce((acc, x, i) => acc + (x === '#' ? i - delta : 0), 0);
    }

    /**
     * @param { Array<string> } state
     * @param { Array<{from: string, to: string}> } rules
     */
    step(state, rules, prevDelta) {
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
        const { delta } = this.normalizeState(nextState);
        return { delta: prevDelta + delta, state: nextState };
    }

    /** @param { Array<string> } state */
    normalizeState(state) {
        let delta;
        const maxDotCount = 5;
        const firstPlant = state.findIndex(x => x === '#');
        if (firstPlant > maxDotCount) {
            delta = maxDotCount - firstPlant;
            state.splice(0, firstPlant - maxDotCount);
        } else {
            delta = maxDotCount - firstPlant;
            state.splice(0, 0, ...('.'.repeat(delta)));
        }

        const stateLength = state.length;
        const lastPlant = state.lastIndexOf('#');
        const dotCount = stateLength - lastPlant - 1;
        if (dotCount > maxDotCount) {
            state.splice(lastPlant + 1, dotCount - maxDotCount);
        } else {
            state.splice(lastPlant + 1, 0, ...('.'.repeat(maxDotCount - dotCount)));
        }
        return { delta, state };
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
