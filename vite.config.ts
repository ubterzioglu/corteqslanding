import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const contributorSourcePath = path.resolve(__dirname, "./info-contributor.html");
const contributorStandaloneRoute = "/commercial/contributor";
const contributorAliasRoute = "/contributor";

const contributorRequestPaths = new Set([
  contributorStandaloneRoute,
  `${contributorStandaloneRoute}/`,
  `${contributorStandaloneRoute}.html`,
  contributorAliasRoute,
  `${contributorAliasRoute}/`,
  `${contributorAliasRoute}.html`,
]);

const readContributorDocument = () => fs.readFileSync(contributorSourcePath, "utf-8");

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api/chat": {
        target: "https://rag.corteqs.net",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    {
      name: "contributor-standalone-document",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const requestPath = req.url?.split("?")[0];

          if (requestPath && contributorRequestPaths.has(requestPath)) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(readContributorDocument());
            return;
          }

          next();
        });
      },
      generateBundle() {
        const source = readContributorDocument();

        this.emitFile({
          type: "asset",
          fileName: "commercial/contributor/index.html",
          source,
        });

        this.emitFile({
          type: "asset",
          fileName: "commercial/contributor.html",
          source,
        });

        this.emitFile({
          type: "asset",
          fileName: "contributor/index.html",
          source,
        });

        this.emitFile({
          type: "asset",
          fileName: "contributor.html",
          source,
        });
      },
    },
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
