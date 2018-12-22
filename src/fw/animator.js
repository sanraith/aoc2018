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
    const targetLength = 5000;
    const maxFps = 60;
    const minFps = 30;

    const canvas = screen.getCanvas();
    const progress = new Progress(45);
    const delayMs = Math.min(Math.max(targetLength / frames.length, 1), 1000 / minFps);
    let currentDelay = 0;
    for (const [index, frame] of frames.entries()) {
        currentDelay += delayMs;
        if (currentDelay < 1000 / maxFps) { continue; }
        canvas.draw([progress.update(index, frames.length)].concat(frame));
        await delay(delayMs);
        currentDelay = 0;
    }
    canvas.dispose();
}

module.exports = {
    animate
};
