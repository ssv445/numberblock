import { BlockPattern, PatternMap } from '../types';

// Helper function to create a line pattern
const createLine = (num: number, vertical = false): BlockPattern => {
    return Array.from({ length: num }, (_, i) => ({
        x: vertical ? 0 : i,
        y: vertical ? i : 0,
    }));
};

// Helper function to create a rectangle pattern
const createRectangle = (width: number, height: number): BlockPattern => {
    const pattern: BlockPattern = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            pattern.push({ x, y });
        }
    }
    return pattern;
};

// Helper function to create an L pattern
const createL = (width: number, height: number): BlockPattern => {
    const pattern: BlockPattern = [];
    // Vertical line
    for (let y = 0; y < height; y++) {
        pattern.push({ x: 0, y });
    }
    // Horizontal line
    for (let x = 1; x < width; x++) {
        pattern.push({ x, y: height - 1 });
    }
    return pattern;
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
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }], // T shape
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
        createLine(11), // Horizontal line
        createLine(11, true), // Vertical line
        [...createRectangle(3, 3), { x: 3, y: 0 }, { x: 3, y: 2 }], // Modified square
    ],
    12: [
        createRectangle(3, 4), // 3x4 rectangle
        createRectangle(4, 3), // 4x3 rectangle
        createLine(12), // Horizontal line
        createLine(12, true), // Vertical line
    ],
    13: [
        createLine(13), // Horizontal line
        createLine(13, true), // Vertical line
        [...createRectangle(3, 4), { x: 3, y: 1 }], // Modified rectangle
    ],
    14: [
        createRectangle(2, 7), // 2x7 rectangle
        createRectangle(7, 2), // 7x2 rectangle
        createLine(14), // Horizontal line
        createLine(14, true), // Vertical line
    ],
    15: [
        createRectangle(3, 5), // 3x5 rectangle
        createRectangle(5, 3), // 5x3 rectangle
        createLine(15), // Horizontal line
        createLine(15, true), // Vertical line
    ],
    16: [
        createRectangle(4, 4), // Square
        createLine(16), // Horizontal line
        createLine(16, true), // Vertical line
    ],
    17: [
        createLine(17), // Horizontal line
        createLine(17, true), // Vertical line
        [...createRectangle(4, 4), { x: 4, y: 0 }], // Modified square
    ],
    18: [
        createRectangle(3, 6), // 3x6 rectangle
        createRectangle(6, 3), // 6x3 rectangle
        createLine(18), // Horizontal line
        createLine(18, true), // Vertical line
    ],
    19: [
        createLine(19), // Horizontal line
        createLine(19, true), // Vertical line
        [...createRectangle(4, 4), { x: 4, y: 0 }, { x: 4, y: 2 }, { x: 0, y: 4 }], // Modified square
    ],
    20: [
        createRectangle(4, 5), // 4x5 rectangle
        createRectangle(5, 4), // 5x4 rectangle
        createLine(20), // Horizontal line
        createLine(20, true), // Vertical line
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