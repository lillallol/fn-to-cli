/**
 * Some tag less description for command foo.
 * @CLI
*/
export declare function foo(_ : {
    /**
     * @description
     * Some tag full description for option `a` of command `foo`.
    */
    a : string,
    /**
     * Some tag less description for option `b` of command `foo`.
     * @default true
     * @flag V
    */
    b? : boolean
}):void;