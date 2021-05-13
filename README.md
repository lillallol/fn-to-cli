# fn-to-cli

## Table of contents

<!--#region toc-->

- [fn-to-cli](#fn-to-cli)
    - [Table of contents](#table-of-contents)
    - [Installation](#installation)
    - [Description](#description)
    - [Code coverage](#code-coverage)
    - [Quick start](#quick-start)
    - [Example](#example)
    - [Documentation](#documentation)
    - [Motivation](#motivation)
    - [Contributing](#contributing)
    - [Changelog](#changelog)
        - [2.0.2](#202)
        - [2.0.1](#201)
        - [2.0.0](#200)
        - [1.0.0](#100)
    - [License](#license)

<!--#endregion toc-->

## Installation

```bash
npm install fn-to-cli
```

## Description

This module converts typescript functions to CLI.

## Code coverage

Code coverage is around 90%.

## Quick start

For a quick start:

0.  execute from terminal:

    ```bash
    npx fn-to-cli --help;
    ```

1.  add `@CLI` JSDoc tag comment to the functions you want to convert to CLI
2.  compile your typescript project to javascript project
3.  execute from terminal:

    ```bash
    npx fn-to-cli;
    ```

If something goes wrong you will receive helpful error messages that will guide you on resolving the error.

## Example

1.  Create a new folder and set it as your current working directory:

    ```bash
    mkdir example; cd ./example;
    ```

2.  Create `./package.json` with the following content:

    <!--#region example-package !./example/package.json-->

    ```json
    {
        "name": "some-random-package-name",
        "version": "1.0.0",
        "private": true,
        "main": "./dist/index.js",
        "bin": "bin/bin.js",
        "scripts": {
            "build-ts": "rm -rf ./dist; npx tsc",
            "build-bin": "rm -rf ./bin; npx fn-to-cli",
            "build": "npm run build-ts && npm run build-bin",
            "test": "jest"
        },
        "devDependencies": {
            "jest": "^26.6.3",
            "typescript": "^4.2.3"
        },
        "dependencies": {
            "fn-to-cli": "file:.."
        }
    }
    
    ```

    <!--#endregion example-package-->

    Notice the bin property in `./package.json`. This is used by `fn-to-cli` as a path to output the generated CLI.

3.  Delete from `./package.json` the line:

    ```bash
    "fn-to-cli": "../"
    ```

4.  Install `fn-to-cli`:

    ```bash
    npm install fn-to-cli;
    ```

    this will also install the rest of the dependencies.

5.  Create `./tsconfig.json` with the following content:

    <!--#region example-tsconfig !./example/tsconfig.json-->

    ```json
    {
        "compilerOptions": {
            "rootDir": "./src",
            "outDir": "./dist",
            "module": "CommonJS",
            "target": "ESNext",
            "declaration": true
        },
        "exclude": [
            "node_modules"
        ]
    }
    ```

    <!--#endregion example-tsconfig-->

6.  Create `./src/index.ts` with the following content:

    <!--#region example-tsconfig !./example/src/index.ts-->

    ```ts
    export { foo } from "./foo";
    
    ```

    <!--#endregion example-tsconfig-->

7.  Create `./src/foo.ts` with the following content:

    <!--#region example-tsconfig !./example/src/foo.ts-->

    ```ts
    /**
     * Some tag less description for command foo.
     * @CLI
     */
    export function foo(_: {
        /**
         * @description
         * Some tag full description for option `a` of command `foo`.
         */
        a: string;
        /**
         * Some tag less description for option `b` of command `foo`.
         * @default true
         * @flag V
         */
        b?: boolean;
    }): void {
        const { a } = _;
        let { b } = _;
        if (b === undefined) b = true;
        console.log(`foo executed with a = "${a}", b = ${b}`);
    }
    
    ```

    <!--#endregion example-tsconfig-->

8.  Create `./src/bar/bar.ts` with the following content:

    <!--#region example-tsconfig !./example/src/bar/bar.ts-->

    ```ts
    /**
     * @description
     * Some tag full description for command `bar`.
     * @CLI baz
     */
    export default function bar(_: {
        /**
         * Some tag less description for option `c` of command `bar`.
         */
        c: boolean;
        /**
         * Some tag less description for option `d` of command `bar`.
         * @private
         * @default true
         */
        d?: boolean;
    }): void {
        const { c } = _;
        let { d } = _;
        if (d === undefined) d = true;
        console.log(`bar executed with c = ${c}, d = ${d}`);
    }
    
    ```

    <!--#endregion example-tsconfig-->

9.  Execute:

    ```bash
    npm run build;
    ```

    This command does two things:

    -   builds typescript to javascript
    -   generates the CLI

10. Now you can use the generated CLI. Here are some examples:

    <!--#region bash-execute !./example/toExecute.bash-->

    ```bash
    node ./bin/bin.js foo --a "'hello'";
    node ./bin/bin.js foo --a "'hello'" -V "false";
    node ./bin/bin.js baz --c "false";
    ```

    <!--#endregion bash-execute-->

## Documentation

The CLI generator works by searching deeply in the directory defined by the property `compilerOptions.outDir` of `tsconfig.json`, for all the `.d.ts` files that have functions with `@CLI` JSDoc tag. These functions become commands to the generated CLI.

The generated CLI is saved to the path defined by the `bin` property of `package.json`, and imports js functions from the directories `compilerOptions.outDir`, and `node_modules`, so it will not work if these folders are missing or moved.

Each function with the `@CLI` JSDoc tag has to:

1.  have a single parameter that is `TypeLiteral`, for example:

    ```
    {
        param1 : string,
        param2 : boolean
    }
    ```

2.  be a function declaration statement, for example:

    -   incorrect:

        ```ts
        const foo = () => {
            //some code
        };
        ```

    -   correct:

        ```ts
        function foo() {
            //some code
        }
        ```

3.  be named or default exported
4.  have name
5.  have description in its JSDoc comment via a `@description` tag or tag-less
6.  same for each property in its parameter type signature
7.  have `@default` JSDoc tag with initialization value for each optional parameter
8.  be inside the `rootDir` directory as defined by the provided `tsconfig.json`
9.  be in a `.ts` file

The functions can have:

1.  `@flag` JSDoc tag for any of its properties. It has to have a single letter as a value which can be used instead of the parameter names in the CLI.
2.  `@cliPrivate` JSDoc tag for any of its optional properties. These properties will not be visible in the documentation of the CLI and will not receive a value even if the user of the CLI provides one for them.

## Motivation

A typescript function with JSDoc comments, contains all the necessary information to be converted automatically to a cli. Why would anyone waste their time doing the conversion manually? Automating that is the only maintainable solution.

## Contributing

I am open to suggestions/pull request to improve this program.

You will find the following commands useful:

-   Clones the github repository of this project:

    ```bash
    git clone https://github.com/lillallol/fn-to-cli
    ```

-   Installs the node modules (nothing will work without them):

    ```bash
    npm install
    ```

-   Tests the source code:

    ```bash
    npm run test-src
    ```

-   Tests the example in the example folder:

    ```bash
    npm run test-example
    ```

-   Lints the source folder using typescript and eslint:

    ```bash
    npm run lint
    ```

-   Builds the typescript code from the `./src` folder to javascript code in `./dist`:

    ```bash
    npm run build-ts
    ```

-   Creates the CLI executable of this program in `./bin/bin.js`:

    ```bash
    npm run build-bin
    ```

    Make sure that the `./dist` exists when you execute this command, otherwise it will not work.

-   Injects in place the generated toc and imported files to `README.md`:

    ```bash
    npm run build-md
    ```

-   Checks the project for spelling mistakes:

    ```bash
    npm run spell-check
    ```

    Take a look at the related configuration `./cspell.json`.

-   Checks `./src` for dead typescript files:

    ```bash
    npm run dead-files
    ```

    Take a look at the related configuration `./unimportedrc.json`.

## Changelog

### 2.0.2

Removed the unnecessary quotation marks from the default values in the CLI generated documentation.

### 2.0.1

**bug fixes:**

Moved `typescript-is` from development dependencies to dependencies.

### 2.0.0

**breaking changes**:

-   Command line arguments are now evaluated with `eval` instead of `JSON.parse`.
<!-- @TODO add an example here -->
-   `-v` and `--version` are reserved for printing the version.
-   `@private` JSDoc tag is now replaced with `@cliPrivate`.
-   The `@CLI` JSDoc tag can now get a value as a custom name for the command.

**non breaking changes**

-   `json5` node module is used for parsing `package.json` and `tsconfig.json`. That means (among others) no more headaches with trailing commas.
-   You can now add any type you want for command options.
-   The default JSDoc tag value is no longer validated that it is the same type as the argument type.

**other**

-   `README.md` has been improved and extra sections like changelog and contributing have been added. You can read the example section code in the `README.md` now.

### 1.0.0

-   Published the package to npm.

## License

MIT
