import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { zipSync, strToU8 } from "fflate";

// Download only public game data. No database credentials or admin session needed.
const api = process.env.CASHXP_GAME_API || "http://localhost:4000";
const baseId = process.env.CASHXP_RUNNER_ID || "sky-runner-reference-2";
const root = new URL("./", import.meta.url),
  sounds = {};
for (const name of ["jump", "collect", "hit", "game-over", "music"]) {
  const path = `assets/sounds/${name}.mp3`;
  try {
    sounds[path] = await readFile(new URL(path, root));
  } catch {
    throw new Error(
      `Add your recording at ${fileURLToPath(new URL(path, root))} before building the sound variant.`,
    );
  }
}
async function get(path) {
  const response = await fetch(api + path);
  if (!response.ok)
    throw new Error(`Could not load ${path}: ${response.status}`);
  return response.json();
}
const { games } = await get("/catalog");
const game = games.find((item) => item.id === baseId);
if (!game || game.renderer !== "three")
  throw new Error(
    "The published Sky Runner game was not found. Set CASHXP_RUNNER_ID if its ID changed.",
  );
const source = await get(`/releases/${game.releaseId}/package`);
const files = Object.fromEntries(
  Object.entries(source.files).map(([path, data]) => [
    path,
    Buffer.from(data, "base64"),
  ]),
);
const manifest = JSON.parse(Buffer.from(files["manifest.json"]).toString());
manifest.id = baseId + "-sounds-in";
const version = game.version.split(".").map(BigInt);
version[2]++;
manifest.version = version.join(".");
// Keep published settings defaults, edited art and all localized content.
manifest.settings = (manifest.settings || []).map((field) => ({
  ...field,
  default: game.values[field.id] ?? field.default,
}));
const result = await build({
  entryPoints: [fileURLToPath(new URL("game.js", root))],
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  write: false,
});
Object.assign(files, sounds, {
  "manifest.json": strToU8(JSON.stringify(manifest, null, 2)),
  "game.min.js": result.outputFiles[0].contents,
});
const zip = zipSync(files, { level: 6 });
if (zip.byteLength > 16 * 1024 * 1024)
  throw new Error(
    "The game ZIP exceeds 16 MB. Compress your MP3s and rebuild.",
  );
const output = new URL("dist/", root);
await mkdir(output, { recursive: true });
const target = new URL(manifest.id + ".zip", output);
await writeFile(target, zip);
console.log("Ready to upload: " + fileURLToPath(target));
