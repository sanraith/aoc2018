// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day24');
const Solution = require('../fw/solution');

class Day24 extends Solution {
    constructor() { super(24, 'System Simulator 20XX'); }

    part1() {
        const { immArmy, infArmy, groups } = this.parseInput();
        this.fight(immArmy, infArmy, groups);

        return groups.reduce((acc, x) => acc + x.units, 0);
    }

    part2() {
        let boost = 0;
        let infections; let immunes;
        do {
            boost++;
            const { immArmy, infArmy, groups } = this.parseInput();
            immunes = immArmy; infections = infArmy;
            for (const imm of immArmy) {
                imm.ap += boost;
            }
            this.fight(immArmy, infArmy, groups);
        } while (infections.length > 0);

        return immunes.reduce((acc, x) => acc + x.units, 0);
    }

    fight(immArmy, infArmy, groups) {
        let hasPairs = true;
        while (immArmy.length > 0 && infArmy.length > 0 && hasPairs) {
            hasPairs = true;
            this.sortByEpInitiativeDescending(groups);
            this.sortByEpInitiativeDescending(immArmy);
            this.sortByEpInitiativeDescending(infArmy);

            // targeting phase
            const selected = new Set();
            const pairs = [];
            for (const attacker of groups) {
                const enemies = immArmy.includes(attacker) ? infArmy : immArmy;
                let enemy; let maxDmg = 0;
                for (const candidate of enemies) {
                    if (selected.has(candidate)) {
                        continue;
                    }
                    const dmg = this.getDamageMultiplier(attacker, candidate);
                    if (dmg > maxDmg) {
                        maxDmg = dmg;
                        enemy = candidate;
                    }
                    if (maxDmg === 2) { break; }
                }
                if (enemy !== undefined) {
                    selected.add(enemy);
                    pairs.push({ attacker, defender: enemy });
                }
            }

            // attacking phase
            // sort by initiative descending
            pairs.sort((a, b) => b.attacker.initiative - a.attacker.initiative);
            hasPairs = pairs.length > 0;
            for (const { attacker, defender } of pairs) {
                if (attacker.units <= 0 || defender.units <= 0) { continue; }
                const multiplier = this.getDamageMultiplier(attacker, defender);
                const dmg = attacker.ap * attacker.units * multiplier;
                const remainingUnits = Math.ceil(Math.max(defender.units * defender.hp - dmg, 0) / defender.hp);
                defender.units = remainingUnits;
                if (defender.units <= 0) {
                    groups.splice(groups.indexOf(defender), 1);
                    if (immArmy.includes(defender)) {
                        immArmy.splice(immArmy.indexOf(defender), 1);
                    } else {
                        infArmy.splice(infArmy.indexOf(defender), 1);
                    }
                }
            }
        }
    }

    getDamageMultiplier(attacker, defender) {
        let multiplier = 1;
        if (defender.immuneTo.has(attacker.type)) {
            multiplier = 0;
        } else if (defender.weakTo.has(attacker.type)) {
            multiplier = 2;
        }
        return multiplier;
    }

    sortByEpInitiativeDescending(groups) {
        // Order by effective power, initiative descending
        groups.sort((a, b) => {
            const epDiff = b.units * b.ap - a.units * a.ap;
            return epDiff === 0 ? b.initiative - a.initiative : epDiff;
        });
    }

    parseInput() {
        const { groups: immArmy, row } = this.parseGroup(this.input, 1, 'immune');
        const { groups: infArmy } = this.parseGroup(this.input, row + 2, 'infection');

        return { immArmy, infArmy, groups: immArmy.concat(infArmy) };
    }

    parseGroup(lines, startRow, party) {
        const pattern = /([0-9]+)[a-z ]+([0-9]+)[a-z ();,]+([0-9]+) ([a-z]+) [a-z ]+([0-9]+)/;
        const weakPattern = /\([a-z ,;]*?weak to ([a-z, ]+)[a-z ,;]*?\)/;
        const immunePattern = /\([a-z ,;]*?immune to ([a-z, ]+)[a-z ,;]*?\)/;
        let row = startRow;
        const groups = [];
        while (row < lines.length && lines[row] !== '') {
            const line = lines[row];
            const [, units, hp, ap, type, initiative] = pattern.exec(line);
            let [, weakTo] = weakPattern.exec(line) || [0, 0];
            weakTo = weakTo ? weakTo.split(', ') : [];
            let [, immuneTo] = immunePattern.exec(line) || [0, 0];
            immuneTo = immuneTo ? immuneTo.split(', ') : [];
            const group = {
                id: row - startRow + 1,
                party,
                units: Number(units),
                hp: Number(hp),
                ap: Number(ap),
                initiative: Number(initiative),
                type,
                weakTo: new Set(weakTo),
                immuneTo: new Set(immuneTo)
            };
            groups.push(group);
            row++;
        }

        return { groups, row };
    }
}

module.exports = Day24;
