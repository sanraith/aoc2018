// Require the lib, get a working terminal
const termkit = require('terminal-kit');
const Victor = require('victor');

const term = termkit.terminal;
const { ScreenBuffer } = termkit;

term.clear();


const { width, height } = term;
const screen = new ScreenBuffer({
    dst: term, x: 0, y: 0
});
const min = new Victor(1, 1);
const max = new Victor(width - 1, height - 1);
const coords = new Victor(2, 2);
const delta = new Victor(1, 1);

setInterval(() => {
    screen.fill({ char: ' ' });
    // screen.clear(); // does not work

    // screen.put({ ...coords, attr: Math.floor(Math.random() * 15 + 1) }, 'o');
    screen.put({ ...coords, attr: 2 }, 'o');
    screen.draw();

    if (coords.x === max.x || coords.x === min.x) { delta.x = -delta.x; }
    if (coords.y === max.y || coords.y === min.y) { delta.y = -delta.y; }
    coords.add(delta);
}, 20);

// process.stdout.write('\x1Bc'); // Clear console

// // The term() function simply output a string to stdout, using current style
// // output "Hello world!" in default terminal's colors
// term('Hello world!\n');

// // This output 'red' in red
// term.red('red');

// // This output 'bold' in bold
// term.bold('bold');

// // output 'mixed' using bold, underlined & red, exposing the style-mixing syntax
// term.bold.underline.red('mixed');

// // printf() style formatting everywhere:
// // this will output 'My name is Jack, I'm 32.' in green
// term.green("My name is %s, I'm %d.\n", 'Jack', 32);

// // Since v0.16.x, style markup are supported as a shorthand.
// // Those two lines produce the same result.
// term('My name is ').red('Jack')(" and I'm ").green('32\n');
// term("My name is ^rJack^ and I'm ^g32\n");

// // Width and height of the terminal
// term('The terminal size is %dx%d', term.width, term.height);

// // Move the cursor at the upper-left corner
// term.moveTo(1, 1);

// // We can always pass additional arguments that will be displayed...
// term.moveTo(1, 1, 'Upper-left corner');

// // ... and formated
// term.moveTo(1, 1, "My name is %s, I'm %d.\n", 'Jack', 32);

// // ... or even combined with other styles
// term.moveTo.cyan(1, 1, "My name is %s, I'm %d.\n", 'Jack', 32);

// // Get some user input
// term.magenta('Enter your name: ');
// term.inputField(
//     (error, input) => {
//         term.green("\nYour name is '%s'\n", input);
//         process.exit();
//     }
// );
