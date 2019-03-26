const { writeFileSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

let branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).replace("\n", "");
let commitId = execSync("git rev-parse HEAD", { encoding: "utf8" }).replace("\n", "");
let commitUrl = "https://github.com/asterics/WebACS/commit/" + commitId;
let date = Date();

let buildInfo = { date, branch, commitId, commitUrl };

writeFileSync(join(process.cwd(), "dist/build.json"), JSON.stringify(buildInfo, null, 4), "utf8");