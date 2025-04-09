'use client';

import { useState, useCallback, useEffect } from 'react';
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

    const [toast, setToast] = useState<{
        message: string;
        visible: boolean;
    }>({
        message: '',
        visible: false
    });

    // Auto-hide toast after 2 seconds
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
    };

    const handleBlockSelect = useCallback((block: Block) => {
        setGameState(prev => ({
            ...prev,
            selectedBlock: {
                ...block,
                id: uuidv4()
            }
        }));
    }, []);

    const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
        setGameState(prev => {
            const newGrid = prev.grid.map(row => row.map(cell => ({
                ...cell,
                block: cell.block ? { ...cell.block } : null
            })));
            const targetCell = newGrid[rowIndex][colIndex];

            // If we have a selected block and the cell is empty, place the block
            if (prev.selectedBlock && !targetCell.block) {
                targetCell.block = { ...prev.selectedBlock };
                if (prev.selectedBlock.originalPosition) {
                    const { row, col } = prev.selectedBlock.originalPosition;
                    newGrid[row][col].block = null;
                }
                return {
                    ...prev,
                    selectedBlock: null,
                    placedBlocks: prev.placedBlocks + 1,
                    grid: newGrid
                };
            }

            // If the cell has a block and no block is selected, pick it up
            if (targetCell.block && !prev.selectedBlock) {
                const pickedBlock = {
                    ...targetCell.block,
                    id: targetCell.block.id,
                    originalPosition: { row: rowIndex, col: colIndex }
                };
                return {
                    ...prev,
                    selectedBlock: pickedBlock,
                    grid: newGrid
                };
            }

            // If trying to place on an occupied cell, show toast and return current state
            if (prev.selectedBlock && targetCell.block) {
                showToast("Can't place block on an occupied cell!");
                return prev;
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

            <Grid
                grid={gameState.grid}
                onCellClick={handleCellClick}
                selectedBlock={gameState.selectedBlock}
            />

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

            {/* Toast notification */}
            {toast.visible && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
                    {toast.message}
                </div>
            )}
        </div>
    );
}; 