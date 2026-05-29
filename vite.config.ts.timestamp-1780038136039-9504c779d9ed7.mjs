// vite.config.ts
import fs from "node:fs";
import { defineConfig } from "file:///C:/temp_private/corteqs/corteqs_landing/node_modules/vite/dist/node/index.js";
import react from "file:///C:/temp_private/corteqs/corteqs_landing/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/temp_private/corteqs/corteqs_landing/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\temp_private\\corteqs\\corteqs_landing";
var standaloneDocuments = [
  {
    slug: "contributor",
    sourcePath: path.resolve(__vite_injected_original_dirname, "./info-contributor.html")
  },
  {
    slug: "influencer-partner",
    sourcePath: path.resolve(__vite_injected_original_dirname, "./info-influencer-partner.html")
  },
  {
    slug: "strategic-partner",
    sourcePath: path.resolve(__vite_injected_original_dirname, "./info-strategic-partner.html")
  },
  {
    slug: "community-leader",
    sourcePath: path.resolve(__vite_injected_original_dirname, "./info-community-leader.html")
  },
  {
    slug: "ambassador",
    sourcePath: path.resolve(__vite_injected_original_dirname, "./info-ambassador.html")
  }
];
var getDocumentRoutes = (slug) => {
  const commercialRoute = `/commercial/${slug}`;
  const aliasRoute = `/${slug}`;
  return [
    commercialRoute,
    `${commercialRoute}/`,
    `${commercialRoute}.html`,
    aliasRoute,
    `${aliasRoute}/`,
    `${aliasRoute}.html`
  ];
};
var standaloneRouteMap = new Map(
  standaloneDocuments.flatMap(
    (document) => getDocumentRoutes(document.slug).map((route) => [route, document.sourcePath])
  )
);
var readStandaloneDocument = (sourcePath) => fs.readFileSync(sourcePath, "utf-8");
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    },
    proxy: {
      "/api/chat": {
        target: "https://rag.corteqs.net",
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "index.html"),
        lansman: path.resolve(__vite_injected_original_dirname, "lansman/index.html")
      }
    }
  },
  plugins: [
    react(),
    {
      name: "standalone-commercial-documents",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const requestPath = req.url?.split("?")[0];
          const sourcePath = requestPath ? standaloneRouteMap.get(requestPath) : void 0;
          if (sourcePath) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(readStandaloneDocument(sourcePath));
            return;
          }
          next();
        });
      },
      generateBundle() {
        for (const document of standaloneDocuments) {
          const source = readStandaloneDocument(document.sourcePath);
          this.emitFile({
            type: "asset",
            fileName: `commercial/${document.slug}/index.html`,
            source
          });
          this.emitFile({
            type: "asset",
            fileName: `commercial/${document.slug}.html`,
            source
          });
          this.emitFile({
            type: "asset",
            fileName: `${document.slug}/index.html`,
            source
          });
          this.emitFile({
            type: "asset",
            fileName: `${document.slug}.html`,
            source
          });
        }
      },
      closeBundle() {
        const outDir = path.resolve(__vite_injected_original_dirname, "dist");
        const rootIndexPath = path.join(outDir, "index.html");
        if (!fs.existsSync(rootIndexPath)) {
          return;
        }
        const commercialDir = path.join(outDir, "commercial");
        fs.mkdirSync(commercialDir, { recursive: true });
        fs.copyFileSync(rootIndexPath, path.join(commercialDir, "index.html"));
        fs.copyFileSync(rootIndexPath, path.join(outDir, "commercial.html"));
      }
    },
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx0ZW1wX3ByaXZhdGVcXFxcY29ydGVxc1xcXFxjb3J0ZXFzX2xhbmRpbmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHRlbXBfcHJpdmF0ZVxcXFxjb3J0ZXFzXFxcXGNvcnRlcXNfbGFuZGluZ1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovdGVtcF9wcml2YXRlL2NvcnRlcXMvY29ydGVxc19sYW5kaW5nL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGZzIGZyb20gXCJub2RlOmZzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuY29uc3Qgc3RhbmRhbG9uZURvY3VtZW50cyA9IFtcbiAge1xuICAgIHNsdWc6IFwiY29udHJpYnV0b3JcIixcbiAgICBzb3VyY2VQYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vaW5mby1jb250cmlidXRvci5odG1sXCIpLFxuICB9LFxuICB7XG4gICAgc2x1ZzogXCJpbmZsdWVuY2VyLXBhcnRuZXJcIixcbiAgICBzb3VyY2VQYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vaW5mby1pbmZsdWVuY2VyLXBhcnRuZXIuaHRtbFwiKSxcbiAgfSxcbiAge1xuICAgIHNsdWc6IFwic3RyYXRlZ2ljLXBhcnRuZXJcIixcbiAgICBzb3VyY2VQYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vaW5mby1zdHJhdGVnaWMtcGFydG5lci5odG1sXCIpLFxuICB9LFxuICB7XG4gICAgc2x1ZzogXCJjb21tdW5pdHktbGVhZGVyXCIsXG4gICAgc291cmNlUGF0aDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL2luZm8tY29tbXVuaXR5LWxlYWRlci5odG1sXCIpLFxuICB9LFxuICB7XG4gICAgc2x1ZzogXCJhbWJhc3NhZG9yXCIsXG4gICAgc291cmNlUGF0aDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL2luZm8tYW1iYXNzYWRvci5odG1sXCIpLFxuICB9LFxuXTtcblxuY29uc3QgZ2V0RG9jdW1lbnRSb3V0ZXMgPSAoc2x1Zzogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGNvbW1lcmNpYWxSb3V0ZSA9IGAvY29tbWVyY2lhbC8ke3NsdWd9YDtcbiAgY29uc3QgYWxpYXNSb3V0ZSA9IGAvJHtzbHVnfWA7XG5cbiAgcmV0dXJuIFtcbiAgICBjb21tZXJjaWFsUm91dGUsXG4gICAgYCR7Y29tbWVyY2lhbFJvdXRlfS9gLFxuICAgIGAke2NvbW1lcmNpYWxSb3V0ZX0uaHRtbGAsXG4gICAgYWxpYXNSb3V0ZSxcbiAgICBgJHthbGlhc1JvdXRlfS9gLFxuICAgIGAke2FsaWFzUm91dGV9Lmh0bWxgLFxuICBdO1xufTtcblxuY29uc3Qgc3RhbmRhbG9uZVJvdXRlTWFwID0gbmV3IE1hcChcbiAgc3RhbmRhbG9uZURvY3VtZW50cy5mbGF0TWFwKChkb2N1bWVudCkgPT5cbiAgICBnZXREb2N1bWVudFJvdXRlcyhkb2N1bWVudC5zbHVnKS5tYXAoKHJvdXRlKSA9PiBbcm91dGUsIGRvY3VtZW50LnNvdXJjZVBhdGhdIGFzIGNvbnN0KSxcbiAgKSxcbik7XG5cbmNvbnN0IHJlYWRTdGFuZGFsb25lRG9jdW1lbnQgPSAoc291cmNlUGF0aDogc3RyaW5nKSA9PlxuICBmcy5yZWFkRmlsZVN5bmMoc291cmNlUGF0aCwgXCJ1dGYtOFwiKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiBmYWxzZSxcbiAgICB9LFxuICAgIHByb3h5OiB7XG4gICAgICBcIi9hcGkvY2hhdFwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwczovL3JhZy5jb3J0ZXFzLm5ldFwiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgICBsYW5zbWFuOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImxhbnNtYW4vaW5kZXguaHRtbFwiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAge1xuICAgICAgbmFtZTogXCJzdGFuZGFsb25lLWNvbW1lcmNpYWwtZG9jdW1lbnRzXCIsXG4gICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVxdWVzdFBhdGggPSByZXEudXJsPy5zcGxpdChcIj9cIilbMF07XG5cbiAgICAgICAgICBjb25zdCBzb3VyY2VQYXRoID0gcmVxdWVzdFBhdGggPyBzdGFuZGFsb25lUm91dGVNYXAuZ2V0KHJlcXVlc3RQYXRoKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChzb3VyY2VQYXRoKSB7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04XCIpO1xuICAgICAgICAgICAgcmVzLmVuZChyZWFkU3RhbmRhbG9uZURvY3VtZW50KHNvdXJjZVBhdGgpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGdlbmVyYXRlQnVuZGxlKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGRvY3VtZW50IG9mIHN0YW5kYWxvbmVEb2N1bWVudHMpIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSByZWFkU3RhbmRhbG9uZURvY3VtZW50KGRvY3VtZW50LnNvdXJjZVBhdGgpO1xuXG4gICAgICAgICAgdGhpcy5lbWl0RmlsZSh7XG4gICAgICAgICAgICB0eXBlOiBcImFzc2V0XCIsXG4gICAgICAgICAgICBmaWxlTmFtZTogYGNvbW1lcmNpYWwvJHtkb2N1bWVudC5zbHVnfS9pbmRleC5odG1sYCxcbiAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICAgICAgdHlwZTogXCJhc3NldFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IGBjb21tZXJjaWFsLyR7ZG9jdW1lbnQuc2x1Z30uaHRtbGAsXG4gICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmVtaXRGaWxlKHtcbiAgICAgICAgICAgIHR5cGU6IFwiYXNzZXRcIixcbiAgICAgICAgICAgIGZpbGVOYW1lOiBgJHtkb2N1bWVudC5zbHVnfS9pbmRleC5odG1sYCxcbiAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICAgICAgdHlwZTogXCJhc3NldFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IGAke2RvY3VtZW50LnNsdWd9Lmh0bWxgLFxuICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICAgIGNvbnN0IG91dERpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKTtcbiAgICAgICAgY29uc3Qgcm9vdEluZGV4UGF0aCA9IHBhdGguam9pbihvdXREaXIsIFwiaW5kZXguaHRtbFwiKTtcblxuICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMocm9vdEluZGV4UGF0aCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21tZXJjaWFsRGlyID0gcGF0aC5qb2luKG91dERpciwgXCJjb21tZXJjaWFsXCIpO1xuICAgICAgICBmcy5ta2RpclN5bmMoY29tbWVyY2lhbERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgIGZzLmNvcHlGaWxlU3luYyhyb290SW5kZXhQYXRoLCBwYXRoLmpvaW4oY29tbWVyY2lhbERpciwgXCJpbmRleC5odG1sXCIpKTtcbiAgICAgICAgZnMuY29weUZpbGVTeW5jKHJvb3RJbmRleFBhdGgsIHBhdGguam9pbihvdXREaXIsIFwiY29tbWVyY2lhbC5odG1sXCIpKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCIsIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCIsIFwiQHRhbnN0YWNrL3F1ZXJ5LWNvcmVcIl0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAi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
