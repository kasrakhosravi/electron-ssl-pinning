module.exports = {
  preset: 'ts-jest',
  runner: '@jest-runner/electron/main',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/lib/']
};
