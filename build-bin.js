const { fnToCLI } = require("./dist/fn-to-cli/fnToCLI.js");
const path = require("path");

/**
 * remember that this file is executed via ts-node from the root of this project
 * hence the paths have to be relative to this root
 */
fnToCLI({
    pathToOutput: path.resolve(process.cwd(), "./bin/bin.js"),
    development: true,
});
