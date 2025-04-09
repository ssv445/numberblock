'use client';

import { useState, useCallback } from 'react';
import { Grid } from './Grid';
import { BlockSelector } from './BlockSelector';
import { Block, Cell, GameState, GRID_SIZE } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

const createEmptyGrid = (): Cell[][] => {
    return Array(GRID_SIZE).fill(null).map(() =>
        Array(GRID_SIZE).fill(null).map(() => ({
            id: uuidv4(),
            block: null
        }))
    );
};

export const Game = () => {
    const [gameState, setGameState] = useState<GameState>({
        selectedBlock: null,
        placedBlocks: 0,
        grid: createEmptyGrid()
    });

    const handleBlockSelect = useCallback((block: Block) => {
        setGameState(prev => ({
            ...prev,
            selectedBlock: { ...block }
        }));
    }, []);

    const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
        setGameState(prev => {
            const newGrid = [...prev.grid.map(row => [...row])];
            const targetCell = newGrid[rowIndex][colIndex];

            // If cell has a block, pick it up
            if (targetCell.block) {
                const pickedBlock = { ...targetCell.block };
                targetCell.block = null;
                return {
                    ...prev,
                    selectedBlock: pickedBlock,
                    placedBlocks: prev.placedBlocks - 1,
                    grid: newGrid
                };
            }

            // If we have a selected block, place it
            if (prev.selectedBlock) {
                targetCell.block = { ...prev.selectedBlock };
                return {
                    ...prev,
                    selectedBlock: null,
                    placedBlocks: prev.placedBlocks + 1,
                    grid: newGrid
                };
            }

            return prev;
        });
    }, []);

    const handleSave = useCallback(() => {
        const canvas = document.createElement('canvas');
        canvas.width = GRID_SIZE * 100;
        canvas.height = GRID_SIZE * 100;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw grid
        gameState.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const x = colIndex * (canvas.width / GRID_SIZE);
                const y = rowIndex * (canvas.height / GRID_SIZE);
                const cellSize = canvas.width / GRID_SIZE;

                ctx.fillStyle = cell.block?.color || '#FFFFFF';
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeStyle = '#000000';
                ctx.strokeRect(x, y, cellSize, cellSize);
            });
        });

        // Create download link
        const link = document.createElement('a');
        link.download = 'number-blocks.png';
        link.href = canvas.toDataURL();
        link.click();
    }, [gameState.grid]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Number Blocks</h1>
                <p className="text-sm text-gray-600">Blocks placed: {gameState.placedBlocks}</p>
            </div>

            <Grid grid={gameState.grid} onCellClick={handleCellClick} />

            <div className="flex flex-col items-center gap-2">
                <BlockSelector
                    selectedBlock={gameState.selectedBlock}
                    onBlockSelect={handleBlockSelect}
                />

                <button
                    onClick={handleSave}
                    className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Save as Image
                </button>
            </div>
        </div>
    );
}; 