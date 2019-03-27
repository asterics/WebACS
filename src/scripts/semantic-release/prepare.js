const { lstatSync, readdirSync, symlinkSync } = require("fs");

let version = process.argv[2];

/* Search `WebACS.zip` in root folder */
const release = readdirSync(process.cwd())
  .filter(e => !lstatSync(e).isDirectory())
  .filter(e => e.match(/^WebACS.zip$/));

/* Rename if `WebACS.zip` found */
if (release.length > 0) {
  symlinkSync("WebACS.zip", `WebACS-v${version}.zip`);
}
