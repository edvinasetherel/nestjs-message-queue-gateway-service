import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    stylistic.configs.customize({
        indent: 4,
        braceStyle: "allman",
        quotes: "double",
        semi: true,
        arrowParens: true,
        jsx: false,
        severity: "error",
    }),
    {
        languageOptions:
        {
            globals:
            {
                ...globals.node,
            },
        },
    },
    {
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "@stylistic/object-property-newline": ["error"],
        },
    },
];
