'use client';

import { Cell, Block, GRID_SIZE } from '@/types/game';

type GridProps = {
    grid: Cell[][];
    onCellClick: (rowIndex: number, colIndex: number) => void;
};

export const Grid = ({ grid, onCellClick }: GridProps) => {
    return (
        <div className="grid grid-cols-10 gap-0.5 bg-gray-200 p-2 rounded-lg">
            {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                    <div
                        key={cell.id}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        className={`
                            w-10 h-10 
                            rounded-sm
                            cursor-pointer 
                            transition-all duration-200 
                            ${cell.block
                                ? 'transform hover:scale-105 shadow-sm'
                                : 'bg-white hover:bg-gray-100 border border-gray-300'
                            }
                        `}
                        style={cell.block ? {
                            backgroundColor: cell.block.color,
                            border: '2px solid rgba(0,0,0,0.2)'
                        } : undefined}
                    />
                ))
            ))}
        </div>
    );
}; 