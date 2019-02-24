module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true
    },
    "extends": "standard",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "V" : "writable",
        "Veload" : "writable",
        "Handlebars" : "readonly",
        "Chart" : "writable"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-console": 1,
        "indent": [2, "tab"],
        "semi": [2,"always"],
        "space-before-function-paren": [2,"never"],
        "spaced-comment": [2,"never"],
        "no-tabs": 0,
        "eqeqeq": 0,
        "space-before-blocks":[2,"never"],
        "comma-spacing":[2,{"before": false,"after": false}]
    }
};