'use client';

import { Cell, Block, GRID_SIZE } from '@/types/game';

type GridProps = {
    grid: Cell[][];
    onCellClick: (rowIndex: number, colIndex: number) => void;
    selectedBlock: Block | null;
};

export const Grid = ({ grid, onCellClick, selectedBlock }: GridProps) => {
    return (
        <div className="grid grid-cols-10 bg-gray-200 p-4 rounded-xl" style={{ gap: '4px' }}>
            {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                    const hasBlock = Boolean(cell.block);
                    const isSelected = hasBlock && cell.block?.id === selectedBlock?.id;

                    return (
                        <div
                            key={cell.id}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                            className={`
                                relative
                                aspect-square
                                w-[38px]
                                flex
                                items-center
                                justify-center
                                rounded-md
                                cursor-pointer 
                                transition-all
                                duration-200
                                ${hasBlock ? 'shadow-sm' : 'hover:bg-gray-100'}
                            `}
                            style={{
                                backgroundColor: hasBlock ? cell.block?.color : 'white',
                                border: isSelected
                                    ? '2px solid #3b82f6'
                                    : hasBlock
                                        ? '2px solid rgba(0,0,0,0.2)'
                                        : '1px solid #e5e7eb',
                            }}
                        >
                            {isSelected && (
                                <div className="absolute inset-[-2px] ring-2 ring-blue-500 rounded-md pointer-events-none" />
                            )}
                        </div>
                    );
                })
            ))}
        </div>
    );
}; 