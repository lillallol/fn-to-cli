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
