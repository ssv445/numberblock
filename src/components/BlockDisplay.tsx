'use client';

import { BlockPattern } from '../types';

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
        Array.from({ length: maxX }, () => false)
    );

    // Fill in the blocks
    pattern.forEach(({ x, y }) => {
        grid[y][x] = true;
    });

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
                    row.map((isBlock, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`w-full h-full rounded transition-colors ${isBlock
                                    ? 'bg-blue-500 border-2 border-blue-700 shadow-sm'
                                    : 'border border-dashed border-gray-300'
                                }`}
                        />
                    ))
                )}
            </div>
        </div>
    );
} 