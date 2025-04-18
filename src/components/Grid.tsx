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
    placedBlocks: number;
    counterColor: string;
};

export const Grid = ({ grid, onCellClick, selectedBlock, maxRow, maxCol, placedBlocks, counterColor }: GridProps) => {
    const gridStyle = {
        gridTemplateColumns: `repeat(${Math.max(maxCol + 2, MIN_GRID_SIZE)}, minmax(36px, 36px))`,
        gridTemplateRows: `repeat(${Math.max(maxRow + 2, MIN_GRID_SIZE)}, minmax(36px, 36px))`,
        gap: '1px',
    };

    return (
        <div className="relative w-full overflow-hidden bg-gray-100">
            <h3 className="text-3xl text-center font-bold text-gray-900 m-1"> {placedBlocks}</h3>
            <div
                className="overflow-auto max-h-[400px] max-w-full p-2 bg-gray-100"
                style={{
                    maxWidth: 'calc(100vw - 1rem)',
                }}
            >
                <div
                    className="grid bg-gray-100 p-[1px]"
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
                                        relative aspect-square w-[36px]
                                        flex items-center justify-center 
                                        rounded-sm cursor-pointer 
                                        transition-all duration-200
                                        ${hasBlock ? 'shadow-sm' : 'hover:bg-gray-50'}
                                       }
                                    `}
                                    style={{
                                        backgroundColor: cell?.block?.color ?? 'white',
                                        border: isSelected
                                            ? '2px solid transparent'
                                            : hasBlock
                                                ? '2px solid rgba(0,0,0,0.2)'
                                                : '1px solid #e5e7eb',
                                    }}
                                >
                                    {isSelected && (
                                        <div className="absolute inset-[-2px] rounded-sm pointer-events-none" />
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