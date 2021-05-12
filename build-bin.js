const { fnToCLI } = require("./dist/fn-to-cli/fnToCLI.js");
const path = require("path");

/**
 * remember that this file is executed via node from the root of this project
 * hence the paths have to be relative to this root i.e. the process.cwd()
 */
fnToCLI({
    pathToOutput: path.resolve(process.cwd(), "./bin/bin.js"),
    development: true,
});