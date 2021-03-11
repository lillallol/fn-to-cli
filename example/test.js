const { exec } = require("child_process");

describe("generated cli example", () => {
    it("works as expected when provided with correct values", async () => {
        await new Promise((res) => {
            exec("node ./bin/bin.js foo --a a", (err, stdout, stderr) => {
                expect(stdout.trim()).toBe("a = a, b = true");
                res();
            });
        });
        await new Promise((res) => {
            exec("node ./bin/bin.js foo --a a -v true", (err, stdout, stderr) => {
                expect(stdout.trim()).toBe("a = a, b = true");
                res();
            });
        });
        await new Promise((res) => {
            exec("node ./bin/bin.js foo --a \"a\" --b false", (err, stdout, stderr) => {
                expect(stdout.trim()).toBe("a = a, b = false");
                res();
            });
        });
        await new Promise((res) => {
            exec("node ./bin/bin.js foo --a \"a\" -v false", (err, stdout, stderr) => {
                expect(stdout.trim()).toBe("a = a, b = false");
                res();
            });
        });
        await new Promise((res) => {
            exec("node ./bin/bin.js bar --c true", (err, stdout, stderr) => {
                expect(stdout.trim()).toBe("c = true");
                res();
            });
        });
        await new Promise((res) => {
            exec("node ./bin/bin.js bar --c false", (err, stdout, stderr) => {
                expect(stdout.trim()).toBe("c = false");
                res();
            });
        });
    });
});
