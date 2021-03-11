export function isDictionaryObject(v : unknown): v is {[x:string] : unknown} {
    return v !== null && typeof v === "object";
}