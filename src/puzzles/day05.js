// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day05');
const Solution = require('../fw/solution');

class Day05 extends Solution {
    constructor() { super(5, 'Alchemical Reduction'); }

    part1() {
        let [a, b] = this.process(this.input[0]);
        let length = a.length;
        do {
            length = a.length;
            for (let i = 0; i < length - 1; i++) {
                if (a[i] === b[i + 1]) {
                    a[i] = '';
                    a[i + 1] = '';
                    b[i] = '';
                    b[i + 1] = '';
                }
            }

            a = this.clean(a);
            b = this.clean(b);
        } while (a.length < length);

        return a.length;
    }

    part2() {
        let minlength = this.input[0].length;
        let minChars;
        for (let charCode = 65; charCode < 91; charCode++) {
            this.progress(charCode, 91, 65);

            let [a, b] = this.process(this.input[0]);
            const charsToRemove = [String.fromCharCode(charCode), String.fromCharCode(charCode + 32)];
            a = Array.from(a.filter(c => !charsToRemove.includes(c)));
            b = Array.from(b.filter(c => !charsToRemove.includes(c)));

            let length = a.length;
            do {
                length = a.length;
                for (let i = 0; i < length - 1; i++) {
                    if (a[i] === b[i + 1]) {
                        a[i] = '';
                        a[i + 1] = '';
                        b[i] = '';
                        b[i + 1] = '';
                    }
                }

                a = this.clean(a);
                b = this.clean(b);
            } while (a.length < length);

            if (length < minlength) {
                minlength = length;
                minChars = charsToRemove;
                debug(minlength, minChars);
            }
        }

        return minlength;
    }

    clean(a) {
        return Array.from(a.filter(c => c !== ''));
    }

    /**
     * @param { String } s
     */
    process(s) {
        const a = Array.from(s);
        const inverse = Array.from(a.map(c => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())));
        return [a, inverse];
    }
}

module.exports = Day05;
