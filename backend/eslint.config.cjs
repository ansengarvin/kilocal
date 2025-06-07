// Use require for all imports
const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");

const lint = tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2024,
            globals: globals.browser,
        },
        plugins: {},
        rules: {
            // Disable fobidding of require()
            "@typescript-eslint/no-require-imports": "off",
        },
    },
);

module.exports = lint;
