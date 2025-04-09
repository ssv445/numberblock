'use client';

import { Cell, Block, GRID_SIZE } from '@/types/game';

type GridProps = {
    grid: Cell[][];
    onCellClick: (rowIndex: number, colIndex: number) => void;
    selectedBlock: Block | null;
};

export const Grid = ({ grid, onCellClick, selectedBlock }: GridProps) => {
    return (
        <div className="grid grid-cols-10 gap-0.5 bg-gray-200 p-2 rounded-lg">
            {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                    const hasBlock = Boolean(cell.block);
                    const isSelected = hasBlock && cell.block?.id === selectedBlock?.id;

                    return (
                        <div
                            key={cell.id}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: hasBlock ? cell.block?.color : 'white',
                                border: isSelected
                                    ? '2px solid #3b82f6' // blue-500 for selected
                                    : hasBlock
                                        ? '2px solid rgba(0,0,0,0.2)'
                                        : '1px solid #e5e7eb',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            }}
                            className={`
                                hover:scale-105
                                ${hasBlock ? 'shadow-sm' : 'hover:bg-gray-100'}
                                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                            `}
                        />
                    );
                })
            ))}
        </div>
    );
}; 