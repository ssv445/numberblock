import { BlockPattern, PatternMap } from '../types';

// Helper function to create a line pattern
const createLine = (num: number, vertical = false, value?: number): BlockPattern => {
    return Array.from({ length: num }, (_, i) => ({
        x: vertical ? 0 : i,
        y: vertical ? i : 0,
        value,
    }));
};

// Helper function to create a rectangle pattern
const createRectangle = (width: number, height: number, value?: number): BlockPattern => {
    const pattern: BlockPattern = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            pattern.push({ x, y, value });
        }
    }
    return pattern;
};

// Helper function to create an L pattern
const createL = (width: number, height: number, value?: number): BlockPattern => {
    const pattern: BlockPattern = [];
    // Vertical line
    for (let y = 0; y < height; y++) {
        pattern.push({ x: 0, y, value });
    }
    // Horizontal line
    for (let x = 1; x < width; x++) {
        pattern.push({ x, y: height - 1, value });
    }
    return pattern;
};

// Helper function to offset a pattern
const offsetPattern = (pattern: BlockPattern, offsetX: number, offsetY: number): BlockPattern => {
    return pattern.map(coord => ({
        ...coord,
        x: coord.x + offsetX,
        y: coord.y + offsetY,
    }));
};

export const allPatterns: PatternMap = {
    1: [
        [{ x: 0, y: 0 }], // Single block
    ],
    2: [
        createLine(2), // Horizontal line
        createLine(2, true), // Vertical line
    ],
    3: [
        createLine(3), // Horizontal line
        createLine(3, true), // Vertical line
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }], // L shape
    ],
    4: [
        createRectangle(2, 2), // Square
        createLine(4), // Horizontal line
        createLine(4, true), // Vertical line
        createL(2, 3), // L shape
    ],
    5: [
        createLine(5), // Horizontal line
        createLine(5, true), // Vertical line
        createL(3, 3), // L shape
    ],
    6: [
        createRectangle(2, 3), // 2x3 rectangle
        createRectangle(3, 2), // 3x2 rectangle
        createLine(6), // Horizontal line
        createLine(6, true), // Vertical line
    ],
    7: [
        createLine(7), // Horizontal line
        createLine(7, true), // Vertical line
        [...createRectangle(2, 3), { x: 2, y: 1 }], // Modified rectangle
    ],
    8: [
        createRectangle(2, 4), // 2x4 rectangle
        createRectangle(4, 2), // 4x2 rectangle
        createLine(8), // Horizontal line
        createLine(8, true), // Vertical line
    ],
    9: [
        createRectangle(3, 3), // Square
        createLine(9), // Horizontal line
        createLine(9, true), // Vertical line
    ],
    10: [
        createRectangle(2, 5), // 2x5 rectangle
        createRectangle(5, 2), // 5x2 rectangle
        createLine(10), // Horizontal line
        createLine(10, true), // Vertical line
    ],
    11: [
        // 11 as 10+1
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            { x: 2, y: 2, value: 1 }
        ],
    ],
    12: [
        // 12 as 10+2
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createLine(2, false, 2), 2, 2)
        ],
    ],
    13: [
        // 13 as 10+3
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createLine(3, false, 3), 2, 2)
        ],
    ],
    14: [
        // 14 as 10+4
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createRectangle(2, 2, 4), 2, 2)
        ],
    ],
    15: [
        // 15 as 10+5
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createLine(5, false, 5), 2, 2)
        ],
    ],
    16: [
        // 16 as 10+6
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createRectangle(2, 3, 6), 2, 2)
        ],
    ],
    17: [
        // 17 as 10+7
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createLine(7, false, 7), 2, 2)
        ],
    ],
    18: [
        // 18 as 10+8
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createRectangle(2, 4, 8), 2, 1)
        ],
    ],
    19: [
        // 19 as 10+9
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createRectangle(3, 3, 9), 2, 1)
        ],
    ],
    20: [
        // 20 as two 10s
        [
            ...offsetPattern(createRectangle(2, 5, 10), 0, 0),
            ...offsetPattern(createRectangle(2, 5, 10), 2, 0)
        ],
    ],
};

export const getPatternsForNumber = (num: number): BlockPattern[] => {
    return allPatterns[num] || [];
};

export const getPattern = (num: number, index: number): BlockPattern | null => {
    const patterns = getPatternsForNumber(num);
    return patterns[index] || null;
};

export const getTotalPatternsForNumber = (num: number): number => {
    return getPatternsForNumber(num).length;
}; 