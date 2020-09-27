module.exports = {
  preset: "ts-jest",
  roots: ["src/"],
  setupFiles: ["./config/env-test.js"],
  setupFilesAfterEnv: ["./src/__tests__/jest.setup.ts"],
  testEnvironment: "node",
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/src/__tests__/jest.setup.ts"],
};
