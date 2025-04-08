'use client';

import { BlockPattern } from '../types';
import { numberColors, rainbowColors } from '../utils/colors';

interface BlockDisplayProps {
    pattern: BlockPattern;
    number: number;
}

export default function BlockDisplay({ pattern, number }: BlockDisplayProps) {
    // Calculate grid dimensions
    const maxX = Math.max(...pattern.map(p => p.x)) + 1;
    const maxY = Math.max(...pattern.map(p => p.y)) + 1;

    // Create a grid representation
    const grid = Array.from({ length: maxY }, () =>
        Array.from({ length: maxX }, () => ({ isBlock: false, value: 0 }))
    );

    // Fill in the blocks
    pattern.forEach(({ x, y, value }) => {
        grid[y][x] = { isBlock: true, value: value ?? number };
    });

    // Get color for a block based on its value
    const getBlockColor = (value: number, index: number) => {
        if (!value) return { bg: 'bg-gray-400', border: 'border-gray-600' };
        if (value === 7) {
            return rainbowColors[index % rainbowColors.length];
        }
        // For numbers > 10, use the color of the first digit
        const baseValue = value > 10 ? Math.floor(value / 10) : value;
        return numberColors[baseValue] || { bg: 'bg-gray-400', border: 'border-gray-600' };
    };

    // Count blocks to track rainbow sequence
    let blockCount = 0;

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Number {number}</h2>
            <div className="inline-grid gap-1 p-4 bg-white rounded-lg shadow-md"
                style={{
                    gridTemplateColumns: `repeat(${maxX}, minmax(48px, 1fr))`,
                    gridTemplateRows: `repeat(${maxY}, 48px)`,
                }}
            >
                {grid.map((row, y) =>
                    row.map(({ isBlock, value }, x) => {
                        const blockColor = isBlock ? getBlockColor(value, blockCount++) : null;

                        return (
                            <div
                                key={`${x}-${y}`}
                                className={`w-full h-full rounded-md transition-colors ${isBlock
                                    ? `${blockColor?.bg} border-2 ${blockColor?.border} shadow-sm`
                                    : 'border border-dashed border-gray-300'
                                    }`}
                                style={{
                                    aspectRatio: '1',
                                }}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
} 