module.exports = {
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
        assets: [{ path: "WebACS-v*.zip", label: "AsTeRICS Docs" }, { path: "dist/build.json", label: "build.json" }]
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
