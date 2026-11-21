// main.ts — entrypoint for the-passport-page-of-a-countr-2-20261121-0318 (authored line: copy entry.png to output)
// Reads ./entry.png, validates PNG signature + 1024x1024 dimensions, copies it to
// $MAKEFUN_OUTPUT_DIR (default /output) as entry.png, prints dimensions + size.
// Node 22 stdlib only, no network.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = new URL("./entry.png", import.meta.url);
const buf = readFileSync(SRC);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(PNG_SIG)) throw new Error("entry.png is not a PNG");
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
if (width !== 1024 || height !== 1024) throw new Error(`bad dimensions ${width}x${height}`);
if (buf.length > 1048576) throw new Error(`entry.png too large: ${buf.length} bytes`);
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.png"), buf);
// Verify the copy landed intact before reporting success.
const written = readFileSync(join(outDir, "entry.png"));
if (written.length !== buf.length || !written.subarray(0, 8).equals(PNG_SIG)) throw new Error("output entry.png failed verification after copy");
console.log(`entry.png ${width}x${height} ${buf.length} bytes -> ${join(outDir, "entry.png")} (verified)`);
