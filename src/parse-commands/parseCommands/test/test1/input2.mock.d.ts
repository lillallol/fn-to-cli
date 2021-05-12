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
     * @cliPrivate
     * @default true
     */
    d?: boolean;
}): void;