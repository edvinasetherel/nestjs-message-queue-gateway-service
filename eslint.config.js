import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import {
    defineConfig,
    globalIgnores,
} from "eslint/config";

export default defineConfig([
    globalIgnores([
        "dist",
    ]),
    {
        files: [
            "**/*.{ts,js}",
        ],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
        ],
        plugins: {
            "@stylistic": stylistic,
        },
        languageOptions: {
            ecmaVersion: "latest",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "@stylistic/indent": [
                "error",
                4,
            ],
            "@stylistic/quotes": [
                "error",
                "double",
            ],
            "@stylistic/semi": [
                "error",
                "always",
            ],
            "@stylistic/comma-dangle": [
                "error",
                "always-multiline",
            ],
            "@stylistic/brace-style": [
                "error",
                "allman",
            ],
            "@stylistic/object-curly-spacing": [
                "error",
                "always",
            ],
            "@stylistic/array-bracket-spacing": [
                "error",
                "never",
            ],
            "@stylistic/array-element-newline": [
                "error",
                "always",
            ],
            "@stylistic/array-bracket-newline": [
                "error",
                {
                    multiline: true,
                    minItems: 1,
                },
            ],
            "@stylistic/object-curly-newline": [
                "error",
                {
                    multiline: true,
                    minProperties: 1,
                },
            ],
            "@stylistic/object-property-newline": [
                "error",
                {
                    allowAllPropertiesOnSameLine: false,
                },
            ],
            "@stylistic/function-call-argument-newline": [
                "error",
                "always",
            ],
            "@stylistic/function-paren-newline": [
                "error",
                "multiline-arguments",
            ],
            "@stylistic/arrow-parens": [
                "error",
                "always",
            ],
            "@stylistic/eol-last": [
                "error",
                "always",
            ],
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/no-multiple-empty-lines": [
                "error",
                {
                    max: 1,
                    maxEOF: 0,
                },
            ],
        },
    },
]);
