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
    // Determine render dimensions based on actual grid data + 1 buffer row/col, but at least MIN_GRID_SIZE
    const currentRows = grid.length;
    const currentCol = currentRows > 0 ? grid[0].length : 0;

    const renderRows = Math.max(currentRows + 1, MIN_GRID_SIZE);
    const renderCols = Math.max(currentCol + 1, MIN_GRID_SIZE);

    const gridStyle = {
        // Use renderRows and renderCols for grid template
        gridTemplateColumns: `repeat(${renderCols}, minmax(40px, 40px))`,
        gridTemplateRows: `repeat(${renderRows}, minmax(40px, 40px))`,
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
                    {/* Loop using renderRows and renderCols */}
                    {Array.from({ length: renderRows }, (_, rowIndex) => (
                        Array.from({ length: renderCols }, (_, colIndex) => {
                            // Access data using optional chaining, as some rendered cells might be outside grid data bounds
                            const cell = grid[rowIndex]?.[colIndex];
                            const hasBlock = Boolean(cell?.block);
                            // Determine selection based on block data, not just selectedBlock existence
                            const isSelected = selectedBlock?.originalPosition?.row === rowIndex &&
                                selectedBlock?.originalPosition?.col === colIndex;

                            return (
                                <div
                                    key={cell?.id || `${rowIndex}-${colIndex}`}
                                    onClick={() => onCellClick(rowIndex, colIndex)}
                                    className={`
                                        relative aspect-square w-[40px]
                                        flex items-center justify-center rounded-sm cursor-pointer 
                                        transition-colors duration-200
                                        ${hasBlock ? 'shadow-sm' : 'bg-white hover:bg-gray-50'} // Apply bg-white explicitly
                                    `}
                                    style={{
                                        backgroundColor: hasBlock ? cell.block?.color : undefined, // Let className handle white background
                                        // Highlight border if the cell holds the currently picked-up block
                                        border: isSelected
                                            ? '2px solid #3b82f6' // Blue border for selected (picked up)
                                            : hasBlock
                                                ? '2px solid rgba(0,0,0,0.2)' // Normal block border
                                                : '1px solid #e5e7eb', // Empty cell border
                                    }}
                                >
                                    {/* Optional: Visual cue for the selected block (picked up) could go here if needed */}
                                    {/* {isSelected && (<div className="absolute inset-0 ring-2 ring-blue-500 rounded-sm pointer-events-none" />)} */}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
        </div>
    );
}; 