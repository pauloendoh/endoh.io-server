/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  modulePathIgnorePatterns: ["node_modules", "build"],
};
