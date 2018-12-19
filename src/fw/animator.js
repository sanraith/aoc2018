/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const debug = require('debug')('aoc.fw.animator');
const delay = require('delay');
const { Progress } = require('clui');
const Screen = require('./screen');

/**
 * @param { Screen } screen
 * @param { Array<Array<string>> } frames
 */
async function animate(screen, frames) {
    if (frames.length === 0) { return; }
    const canvas = screen.getCanvas();
    const progress = new Progress(45);
    const targetLength = 3000;
    const delayMs = Math.min(targetLength / frames.length, 50);
    for (const [index, frame] of frames.entries()) {
        canvas.draw([progress.update(index, frames.length)].concat(frame));
        await delay(delayMs);
    }
}

module.exports = {
    animate
};
