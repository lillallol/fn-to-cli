Download this example project and set it as your current working directory in terminal.

At the `package.json` file, remove:

```json
    "dependencies": {
        "fn-to-cli": "../"
    }
```
Then run:

```bash
npm install;
npm install fn-to-cli;
npm run build;
```

Now you can use the generated CLI. Here are some examples:

```bash
node ./bin/bin.js --help;
node ./bin/bin.js foo -h;
node ./bin/bin.js bar --help;
node ./bin/bin.js foo --a --help;
node ./bin/bin.js foo --a "hello";
node ./bin/bin.js foo -v --help;
node ./bin/bin.js foo --a "hello" -v true;
```

Take a look at the src folder.