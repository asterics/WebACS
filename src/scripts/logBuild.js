const { BRANCH } = process.env;
const { writeFileSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

const branch = BRANCH ? BRANCH : execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).replace("\n", "");
const commitId = execSync("git rev-parse HEAD", { encoding: "utf8" }).replace("\n", "");
const commitUrl = "https://github.com/asterics/WebACS/commit/" + commitId;
const date = Date();

const buildInfo = JSON.stringify({ date, branch, commitId, commitUrl }, null, 4);
console.log("Creating build information:")
console.log(buildInfo);
writeFileSync(join(process.cwd(), "dist/build.json"), buildInfo, "utf8");