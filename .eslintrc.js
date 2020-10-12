module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        'brace-style': [2, 'stroustrup', {
            allowSingleLine: true
        }],

        indent: [2, 4, {
            SwitchCase: 1,
            FunctionDeclaration: {
                parameters: 'first',
            },
            FunctionExpression: {
                parameters: 'first',
            },
            CallExpression: {
                arguments: 'first',
            },
            ArrayExpression: 'first',
            ObjectExpression: 'first',
            ImportDeclaration: 'first'
        }],

        'space-before-function-paren': [2, {
            asyncArrow: 'always',
            anonymous: 'never',
            named: 'never'
        }],

        semi: [0, 'never'],

        'object-property-newline': [0],

        'vue/script-indent': ['error', 4, {
            baseIndent: 1,
            switchCase: 1
        }],
        'vue/html-indent': ['error', 4, { baseIndent: 1 }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off'
            }
        },
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true
            }
        }
    ]
}
