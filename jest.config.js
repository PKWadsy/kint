/** @type {import('ts-jest').JestConfigWithTsJest} */

import { pathsToModuleNameMapper } from "ts-jest";
import { readFileSync } from "fs";
import { resolve } from "path";

const tsconfig = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "test", "tsconfig.json")),
);

export default {
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  modulePaths: [tsconfig.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),

  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: [
    "src/index.ts",
    "/node_modules/",
    "/dist/",
    "/types/",
    "/test/.*(\\.js|.ts)",
  ],
  transform: {
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./test/tsconfig.json",
      },
    ],
  },
};
