const path = require('path');

const root = path.join(__dirname, '..', '..');

module.exports = {
    puzzleDir: path.join(root, 'src', 'puzzles'),
    inputDir: path.join(root, 'input')
};
