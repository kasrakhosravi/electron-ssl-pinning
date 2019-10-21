module.exports = {
  preset: 'ts-jest',
  runner: '@jest-runner/electron/main',
  testTimeout: 15000,
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/lib/']
};
