// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.puzzles.day08');
const Solution = require('../fw/solution');

class Node {
    constructor() {
        /** @type { Array<Number> } */
        this.metadata = [];
        /** @type { Array<Node> } */
        this.nodes = [];
        this.value = 0;
    }
}

class Day08 extends Solution {
    constructor() { super(8, 'Memory Maneuver'); }

    part1() {
        const result = this.parseTree(this.getNumbers());
        return result.totalMetadataSum;
    }

    part2() {
        const result = this.parseTree(this.getNumbers());
        return result.node.value;
    }

    /**
     * @param { Array<Number> } numbers
     * @param { Number } start
     */
    parseTree(numbers, start = 0) {
        const node = new Node();
        const nodeCount = numbers[start];
        const metCount = numbers[start + 1];
        let pos = start + 2;
        let totalMetadataSum = 0;

        for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
            const result = this.parseTree(numbers, pos);
            node.nodes.push(result.node);
            pos = result.pos;
            totalMetadataSum += result.totalMetadataSum;
        }

        for (let metIndex = 0; metIndex < metCount; metIndex++) {
            node.metadata.push(numbers[pos]);
            pos++;
        }
        const metadataSum = node.metadata.reduce((acc, x) => acc + x, 0);
        totalMetadataSum += metadataSum;

        if (node.nodes.length === 0) {
            node.value = metadataSum;
        } else {
            node.value = node.metadata.reduce((acc, x) => acc
                + ((x <= node.nodes.length) ? node.nodes[x - 1].value : 0), 0);
        }

        return { node, pos, totalMetadataSum };
    }

    getNumbers() {
        return this.input[0].split(' ').map(x => parseInt(x, 10));
    }
}

module.exports = Day08;
