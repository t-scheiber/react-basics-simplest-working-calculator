module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.jsx"],
  transform: { "^.+\\.[jt]sx?$": ["ts-jest", { tsconfig: { allowJs: true, checkJs: false, jsx: "react-jsx", module: "CommonJS", isolatedModules: true, esModuleInterop: true } }] },
  moduleNameMapper: { "\\.css$": "<rootDir>/tests/style-mock.cjs" },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.cjs"],
};
