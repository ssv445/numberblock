'use client';

import { Cell, Block, MIN_GRID_SIZE } from '@/types/game';

type GridProps = {
    grid: Cell[][];
    onCellClick: (rowIndex: number, colIndex: number) => void;
    selectedBlock: Block | null;
    // maxRow and maxCol are no longer strictly needed for rendering bounds,
    // but might be useful for other hints in the future. Keep them for now.
    maxRow: number;
    maxCol: number;
};

export const Grid = ({ grid, onCellClick, selectedBlock, maxRow, maxCol }: GridProps) => {
    const gridStyle = {
        gridTemplateColumns: `repeat(${Math.max(maxCol + 2, MIN_GRID_SIZE)}, minmax(40px, 40px))`,
        gridTemplateRows: `repeat(${Math.max(maxRow + 2, MIN_GRID_SIZE)}, minmax(40px, 40px))`,
        gap: '1px',
    };

    return (
        <div className="relative w-full overflow-hidden bg-gray-100 rounded-xl">
            <div
                className="overflow-auto max-h-[600px] max-w-full p-4 bg-gray-200"
                style={{
                    maxWidth: 'calc(100vw - 2rem)',
                }}
            >
                <div
                    className="grid bg-gray-300 p-[1px] rounded-lg"
                    style={gridStyle}
                >
                    {Array.from({ length: Math.max(maxRow + 2, MIN_GRID_SIZE) }, (_, rowIndex) => (
                        Array.from({ length: Math.max(maxCol + 2, MIN_GRID_SIZE) }, (_, colIndex) => {
                            const cell = grid[rowIndex]?.[colIndex];
                            const hasBlock = Boolean(cell?.block);
                            const isSelected = hasBlock && cell?.block?.id === selectedBlock?.id;

                            return (
                                <div
                                    key={cell?.id || `${rowIndex}-${colIndex}`}
                                    onClick={() => onCellClick(rowIndex, colIndex)}
                                    className={`
                                        relative aspect-square w-[40px]
                                        flex items-center justify-center 
                                        rounded-sm cursor-pointer 
                                        transition-all duration-200
                                        ${hasBlock ? 'shadow-sm' : 'hover:bg-gray-50'}
                                        ${isSelected ? 'animate-rainbow-glow' : ''}
                                    `}
                                    style={{
                                        backgroundColor: hasBlock ? cell.block?.color : 'white',
                                        border: isSelected
                                            ? '2px solid transparent'
                                            : hasBlock
                                                ? '2px solid rgba(0,0,0,0.2)'
                                                : '1px solid #e5e7eb',
                                    }}
                                >
                                    {isSelected && (
                                        <div className="absolute inset-[-2px] rounded-sm pointer-events-none animate-rainbow-border" />
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
        </div>
    );
}; 