const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

describe("generated cli example", () => {
    it("works as expected when provided with correct values", async () => {
        const absolutePathToExecuteFile = path.resolve(__dirname, "./toExecute.bash");
        const toExecuteFileSrc = fs.readFileSync(absolutePathToExecuteFile, { encoding: "utf-8" });
        const toExecuteFileSrcLines = toExecuteFileSrc.split("\n");

        const toBe = [
            `foo executed with a = "hello", b = true`,
            `foo executed with a = "hello", b = false`,
            `bar executed with c = false, d = true`,
        ];

        for (let i = 0; i < toExecuteFileSrcLines.length; i++) {
            await new Promise((res) => {
                exec(toExecuteFileSrcLines[i], (err, stdout, stderr) => {
                    expect(stdout.trim()).toBe(toBe[i]);
                    res();
                });
            }).catch((e) => console.error(e));
        }
    });
});
