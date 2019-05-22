module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "max-len": ["error", 120],
        "arrow-parens": ["error", "as-needed"],
        "comma-dangle": ["error", "only-multiline"],
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
        "no-restricted-syntax": "off",
        "no-plusplus": "off",
        "class-methods-use-this": "off",
        "prefer-destructuring": "off",
        "no-confusing-arrow": "off",
        "no-return-assign": ["error", "except-parens"],
        "no-continue": "off",
        "object-curly-newline": "off",
    }
};