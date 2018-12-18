/* eslint-disable no-await-in-loop */
const delay = require('delay');
const Screen = require('./screen');

const screen = new Screen();
screen.addHeader('Hello!');
screen.addHeader('Line 2');

const canvas = screen.getCanvas();
(async function run() {
    for (let i = 0; i < 50; i++) {
        const lines = [];
        for (let j = 0; j < 20; j++) {
            lines.push('x'.repeat(i));
        }
        canvas.draw(lines);
        await delay(50);
    }
    canvas.clear();
}());
