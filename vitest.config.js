import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { URL } from "url";

export default defineConfig({
    test: {
        globals: true,
        root: "./",
        envDir: "./config",
    },
    resolve: {
        alias: {
            "#app": fileURLToPath(new URL("./src/app", import.meta.url)),
            "#tests": fileURLToPath(new URL("./tests", import.meta.url)),
            "#adapters": fileURLToPath(new URL("./src/adapters", import.meta.url)),
        },
    },
});
