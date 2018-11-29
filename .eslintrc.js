module.exports = {
    "extends": "airbnb-base",
    "rules": {
        // windows linebreaks when not in production environment
        "linebreak-style": ["error", process.env.NODE_ENV === 'prod' ? "unix" : "windows"],
        "indent": ["error", 4],
        "max-len": ["error", 120],
        "arrow-parens": ["error", "as-needed"],
        "comma-dangle": ["error", "only-multiline"],
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    }
};