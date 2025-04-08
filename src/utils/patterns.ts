import { BlockPattern } from '../types';


// Helper function to stringify a pattern for comparison
function stringifyPattern(pattern: BlockPattern): string {
    const sortedPattern = [...pattern].sort((a, b) => {
        if (a.x !== b.x) return a.x - b.x;
        return a.y - b.y;
    });
    return sortedPattern.map(c => `${c.x},${c.y}`).join(';');
}

// Helper function to normalize a pattern to start at (0,0)
function normalizePattern(pattern: BlockPattern): BlockPattern {
    if (pattern.length === 0) return [];

    let minX = pattern[0].x;
    let minY = pattern[0].y;
    for (let i = 1; i < pattern.length; i++) {
        minX = Math.min(minX, pattern[i].x);
        minY = Math.min(minY, pattern[i].y);
    }

    return pattern.map(coord => ({
        x: coord.x - minX,
        y: coord.y - minY,
        value: coord.value,
    }));
}

// Helper function to rotate a pattern 90 degrees clockwise
function rotatePattern(pattern: BlockPattern): BlockPattern {
    const maxY = Math.max(...pattern.map(p => p.y));
    return pattern.map(({ x, y, value }) => ({
        x: maxY - y,
        y: x,
        value,
    }));
}

// Helper function to flip a pattern horizontally
function flipPattern(pattern: BlockPattern): BlockPattern {
    const maxX = Math.max(...pattern.map(p => p.x));
    return pattern.map(({ x, y, value }) => ({
        x: maxX - x,
        y,
        value,
    }));
}

// Generate all unique fixed polyominoes of size n
function generateFixedPolyominoes(n: number, value?: number): BlockPattern[] {
    if (n <= 0) return [];
    if (n === 1) return [[{ x: 0, y: 0, value }]];

    const uniquePatterns = new Set<string>();
    const resultPatterns: BlockPattern[] = [];
    const occupied = new Set<string>();
    const currentPattern: { x: number; y: number; value?: number }[] = [];

    function findPatterns(k: number) {
        if (k === n) {
            const normalized = normalizePattern([...currentPattern]);
            const patternString = stringifyPattern(normalized);
            if (!uniquePatterns.has(patternString)) {
                uniquePatterns.add(patternString);
                resultPatterns.push(normalized);
            }
            return;
        }

        const possibleNextCoords = new Set<string>();
        const neighbors = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ];

        currentPattern.forEach(coord => {
            neighbors.forEach(neighbor => {
                const nextX = coord.x + neighbor.dx;
                const nextY = coord.y + neighbor.dy;
                const coordStr = `${nextX},${nextY}`;
                if (!occupied.has(coordStr)) {
                    possibleNextCoords.add(coordStr);
                }
            });
        });

        possibleNextCoords.forEach(coordStr => {
            const [xStr, yStr] = coordStr.split(',');
            const nextCoord = { x: parseInt(xStr, 10), y: parseInt(yStr, 10), value };

            currentPattern.push(nextCoord);
            occupied.add(coordStr);

            findPatterns(k + 1);

            occupied.delete(coordStr);
            currentPattern.pop();
        });
    }

    const startCoord = { x: 0, y: 0, value };
    currentPattern.push(startCoord);
    occupied.add("0,0");
    findPatterns(1);

    return resultPatterns;
}

// Generate all variations (rotations and reflections) of a pattern
function generateVariations(pattern: BlockPattern): BlockPattern[] {
    const variations: BlockPattern[] = [pattern];

    // Add rotations
    let rotated = pattern;
    for (let i = 0; i < 3; i++) {
        rotated = rotatePattern(rotated);
        variations.push(rotated);
    }

    // Add flipped versions and their rotations
    const flipped = flipPattern(pattern);
    variations.push(flipped);
    rotated = flipped;
    for (let i = 0; i < 3; i++) {
        rotated = rotatePattern(rotated);
        variations.push(rotated);
    }

    // Remove duplicates
    const uniqueVariations = Array.from(new Set(variations.map(p => stringifyPattern(p))))
        .map(s => {
            const coords = s.split(';').map(coord => {
                const [x, y] = coord.split(',').map(Number);
                return { x, y, value: pattern[0].value };
            });
            return coords;
        });

    return uniqueVariations;
}

// Pre-compute patterns for numbers 1-10
const precomputedPatterns: Record<number, BlockPattern[]> = {};

// Helper function to combine patterns
function combinePatterns(pattern1: BlockPattern, pattern2: BlockPattern, offsetX: number, offsetY: number): BlockPattern {
    return [
        ...pattern1,
        ...pattern2.map(coord => ({
            x: coord.x + offsetX,
            y: coord.y + offsetY,
            value: coord.value,
        })),
    ];
}

// Generate patterns for numbers > 10 by combining smaller patterns
function generateCompositePattern(num: number): BlockPattern[] {
    const tens = Math.floor(num / 10);
    const ones = num % 10;

    if (ones === 0) {
        // For multiples of 10, combine two patterns of 5
        const patterns5 = generateFixedPolyominoes(5, 5);
        return patterns5.flatMap(pattern5a =>
            patterns5.map(pattern5b =>
                combinePatterns(
                    pattern5a,
                    pattern5b,
                    Math.max(...pattern5a.map(p => p.x)) + 2,
                    0
                )
            )
        );
    }

    // Combine a pattern of 10 with a pattern of the remainder
    const patterns10 = generateFixedPolyominoes(10, 10);
    const patternsOnes = generateFixedPolyominoes(ones, ones);

    return patterns10.flatMap(pattern10 =>
        patternsOnes.map(patternOnes =>
            combinePatterns(
                pattern10,
                patternOnes,
                Math.max(...pattern10.map(p => p.x)) + 2,
                0
            )
        )
    );
}

// Export functions
export const getPatternsForNumber = (num: number): BlockPattern[] => {
    if (num <= 10) {
        // Generate patterns on demand
        const basePatterns = generateFixedPolyominoes(num, num);
        // Generate all variations for each pattern
        return basePatterns.flatMap(pattern => generateVariations(pattern));
    }
    return generateCompositePattern(num);
};

export const getPattern = (num: number, index: number): BlockPattern | null => {
    const patterns = getPatternsForNumber(num);
    return patterns[index] || null;
};

export const getTotalPatternsForNumber = (num: number): number => {
    return getPatternsForNumber(num).length;
}; 