module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
  verbose: true,
  setupFiles: [
    "<rootDir>/jest.setup.js",
    "jest-canvas-mock"
  ],
  testURL: 'http://localhost:8080',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    beforeParse (window) {
      window.alert = (msg) => { console.warn(msg); };
      window.matchMedia = () => ({});
      window.scrollTo = () => { };
    }
  }, 
}