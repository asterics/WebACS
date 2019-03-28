const { release_comment } = process.env;
const successComment = release_comment
  ? ":tada: This issue has been resolved in version ${nextRelease.version} :tada:\n\nThe release is available on [GitHub release](<github_release_url>)"
  : false;

const config = {
  repositoryUrl: "https://github.com/asterics/WebACS",
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/npm",
      {
        npmPublish: false
        // tarballDir: "dist"
      }
    ],
    [
      "@semantic-release/github",
      {
        assets: [{ path: "WebACS-v*.zip", label: "AsTeRICS WebACS" }, { path: "dist/build.json", label: "build.json" }],
        successComment
      }
    ],
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [{ type: "docs", scope: "README", release: "patch" }, { type: "major", release: "major" }],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"]
        }
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular",
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        },
        writerOpts: {
          commitsSort: ["subject", "scope"]
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "node src/scripts/semantic-release/prepare.js ${nextRelease.version} ${options.branch} ${commits.length} ${Date.now()}"
      }
    ]
  ],
  dryRun: false,
  ci: false
};

console.log(successComment);
console.log(config);

module.exports = config;
