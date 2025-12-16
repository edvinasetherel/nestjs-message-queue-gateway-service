import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { URL } from "url";

export default defineConfig({
    test: {
        globals: true,
        root: "./",
    },
    plugins: [
        swc.vite({
            module: { type: "es6" },
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@tests": fileURLToPath(new URL("./tests", import.meta.url)),
        },
    },
});
