// eslint-disable-next-line no-unused-vars
const debug = require('debug')('aoc.fw.screen');
const termkit = require('terminal-kit');

const { ScreenBuffer, TextBuffer } = termkit;

class Canvas {
    constructor(canvasBuffer, parentRedraw) {
        this.buffer = canvasBuffer;
        this.parentRedraw = parentRedraw;
    }

    get width() { return this.buffer.width; }

    draw(lines, color = 15) {
        this.buffer.fill({ char: ' ' });
        for (const [y, line] of lines.entries()) {
            this.buffer.put({ x: 0, y, attr: color }, line);
        }
        this.redraw();
    }

    clear() {
        this.buffer.fill({ char: ' ' });
        this.redraw();
    }

    redraw() {
        this.buffer.draw();
        this.parentRedraw();
    }
}

class Screen {
    constructor() {
        this.term = termkit.terminal;
        this.term.clear();
        /** @type { ScreenBuffer } */
        this.screen = new ScreenBuffer({
            dst: this.term, x: 1, y: 1, width: this.term.width, height: this.term.height
        });
        this.textBuffer = new TextBuffer({
            dst: this.screen, x: 0, y: 0
        });
        this.lines = [];
        this.maxLineCount = Math.floor(this.screen.height / 3);
    }

    clear() {
        this.screen.fill({ char: ' ' });
    }

    redraw() {
        this.textBuffer.draw({ y: this._headerTop });
        this.screen.draw();
        this.term.moveTo(0, this._headerHeight);
    }

    /** @param { string } line */
    addHeader(line) {
        const lines = line.split(/\r\n?|\n/g);
        this.lines.push(...lines);

        for (const l of lines) {
            this.textBuffer.insert(l);
            this.textBuffer.insert('\n');
        }

        this.redraw();
    }

    get _headerTop() {
        return Math.min(0, this.maxLineCount - this.lines.length);
    }

    get _headerHeight() {
        return this._headerTop < 0 ? this.maxLineCount : this.lines.length + 1;
    }

    getCanvas() {
        const canvasBuffer = new ScreenBuffer({
            dst: this.screen, x: 0, y: this._headerHeight
        });
        return new Canvas(canvasBuffer, () => this.screen.draw());
    }
}

module.exports = Screen;
