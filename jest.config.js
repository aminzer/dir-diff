export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@aminzer/traverse-directory)"
  ]
};
