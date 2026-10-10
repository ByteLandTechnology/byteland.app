import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../out",
);
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOSTNAME ?? "127.0.0.1";
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

if (!existsSync(root)) {
  throw new Error(`Missing ${root}; run npm run build before browser tests.`);
}

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url, `http://${host}`).pathname,
    );
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }
  const resolved = path.resolve(root, `.${pathname}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  const candidates = [
    resolved,
    `${resolved}.html`,
    path.join(resolved, "index.html"),
  ];
  const file = candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );
  if (!file) {
    const notFoundPage = path.join(root, "404.html");
    if (existsSync(notFoundPage)) {
      response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      if (request.method === "HEAD") response.end();
      else createReadStream(notFoundPage).pipe(response);
    } else {
      response
        .writeHead(404, { "content-type": "text/plain; charset=utf-8" })
        .end("Not found");
    }
    return;
  }
  response.writeHead(200, {
    "content-type": types[path.extname(file)] ?? "application/octet-stream",
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(file).pipe(response);
}).listen(port, host, () => {
  console.log(`Serving static export ${root} at http://${host}:${port}`);
});
