import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const ragApiUrl = "https://rag.corteqs.net/api/chat";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const securityHeaders = {
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "index, follow",
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    ...securityHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
};

const ensureDistExists = async () => {
  try {
    await access(path.join(distDir, "index.html"));
  } catch {
    throw new Error("dist/index.html bulunamadi. Once `npm run build` calistirin.");
  }
};

const writeRuntimeConfig = async () => {
  await mkdir(distDir, { recursive: true });

  const appConfig = {
    VITE_SUPABASE_PROJECT_ID: process.env.VITE_SUPABASE_PROJECT_ID ?? "",
    VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? "",
  };

  await writeFile(
    path.join(distDir, "env-config.js"),
    `window.__APP_CONFIG__ = ${JSON.stringify(appConfig, null, 2)};\n`,
    "utf8",
  );
};

const normalizeRequestPath = (requestUrl) => {
  const pathname = new URL(requestUrl, "http://localhost").pathname;
  const decodedPath = decodeURIComponent(pathname);
  const normalizedPath = path.posix.normalize(decodedPath);

  if (normalizedPath.startsWith("/..")) {
    return null;
  }

  return normalizedPath;
};

const hasFileExtension = (requestPath) =>
  path.posix.extname(requestPath) !== "";

const getCacheHeaders = (requestPath, filePath) => {
  if (path.basename(filePath) === "env-config.js" || path.basename(filePath) === "index.html") {
    return { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" };
  }

  if (requestPath.startsWith("/assets/")) {
    return { "Cache-Control": "public, max-age=31536000, immutable" };
  }

  return {};
};

const streamFile = async (res, filePath, requestPath = "/") => {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes.get(extension) ?? "application/octet-stream";

  res.writeHead(200, {
    ...securityHeaders,
    "Content-Type": contentType,
    ...getCacheHeaders(requestPath, filePath),
  });

  createReadStream(filePath).pipe(res);
};

const handleRagProxy = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return;
  }

  if (!process.env.RAG_API_SECRET) {
    sendJson(res, 500, { error: "RAG_API_SECRET missing" });
    return;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const upstream = await fetch(ragApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RAG_API_SECRET}`,
      "Content-Type": req.headers["content-type"] ?? "application/json",
    },
    body: Buffer.concat(chunks),
  });

  const body = Buffer.from(await upstream.arrayBuffer());
  const responseHeaders = {
    ...securityHeaders,
    "Content-Type": upstream.headers.get("content-type") ?? "application/json; charset=utf-8",
  };

  res.writeHead(upstream.status, responseHeaders);
  res.end(body);
};

const serveApp = async (req, res) => {
  try {
    const requestPath = normalizeRequestPath(req.url ?? "/");

    if (!requestPath) {
      sendJson(res, 400, { error: "Bad Request" });
      return;
    }

    if (requestPath === "/api/chat") {
      await handleRagProxy(req, res);
      return;
    }

    if (!["GET", "HEAD"].includes(req.method ?? "GET")) {
      sendJson(res, 405, { error: "Method Not Allowed" });
      return;
    }

    const candidatePath = path.join(distDir, requestPath.replace(/^\/+/, ""));

    if (requestPath !== "/") {
      try {
        const fileStats = await stat(candidatePath);

        if (fileStats.isFile()) {
          await streamFile(res, candidatePath, requestPath);
          return;
        }

        if (fileStats.isDirectory()) {
          const nestedIndex = path.join(candidatePath, "index.html");
          await access(nestedIndex);
          await streamFile(res, nestedIndex, requestPath);
          return;
        }
      } catch {
        if (hasFileExtension(requestPath)) {
          sendJson(res, 404, { error: "Not Found" });
          return;
        }

        // SPA fallback below.
      }
    }

    const appShell = path.join(distDir, "index.html");
    await streamFile(res, appShell, "/index.html");
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal Server Error" });
  }
};

await ensureDistExists();
await writeRuntimeConfig();

createServer((req, res) => {
  void serveApp(req, res);
}).listen(port, "0.0.0.0", () => {
  console.log(`Serving dist on http://0.0.0.0:${port}`);
});
