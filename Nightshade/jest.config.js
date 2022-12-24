/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/{!(index.ts),}'],
  setupFiles: ['dotenv/config'],
};
