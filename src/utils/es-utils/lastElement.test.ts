import { lastElement } from "./lastElement";

describe(lastElement.name, () => {
    it.each<
        [
            {
                array: unknown[];
                _lastElement: unknown;
            }
        ]
    >([
        [
            {
                array: [0],
                _lastElement: 0,
            },
        ],
        [
            {
                array: [0, 1],
                _lastElement: 1,
            },
        ],
        [
            {
                array: [0, 1, 2],
                _lastElement: 2,
            },
        ],
    ])("returns the last element of the provided array", ({ array, _lastElement }) => {
        expect(lastElement(array)).toBe(_lastElement);
    });
});
