    import { defineConfig } from "vite";

    export default defineConfig({
    server: {
        port: 4321,
    },
    build: {
        rollupOptions: {
        input: {
            main: "./index.html",
            app: "./index_app.html",
        },
        },
    },
    });
