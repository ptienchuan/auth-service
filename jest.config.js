module.exports = {
  preset: "ts-jest",
  rootDir: "src",
  setupFiles: ["<rootDir>/__tests__/jest-env.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.ts"],
  testEnvironment: "node",
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__/jest.setup.ts",
    "<rootDir>/__tests__/jest-env.setup.ts",
  ],
};
