'use client';

import { useState, useCallback, useEffect } from 'react';
import { Grid } from './Grid';
import { BlockSelector } from './BlockSelector';
import { Block, Cell, GameState, INITIAL_GRID_SIZE, MIN_GRID_SIZE } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

const createEmptyGrid = (size: number): Cell[][] => {
    return Array(size).fill(null).map(() =>
        Array(size).fill(null).map(() => ({
            id: uuidv4(),
            block: null
        }))
    );
};

export const Game = () => {
    const [gameState, setGameState] = useState<GameState>({
        selectedBlock: null,
        placedBlocks: 0,
        grid: createEmptyGrid(INITIAL_GRID_SIZE),
        maxRow: -1,
        maxCol: -1
    });

    const [toast, setToast] = useState<{
        message: string;
        visible: boolean;
    }>({
        message: '',
        visible: false
    });

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = useCallback((message: string) => {
        setToast({ message, visible: true });
    }, []);

    const handleBlockSelect = useCallback((block: Block) => {
        setGameState(prev => ({
            ...prev,
            selectedBlock: { ...block, id: uuidv4() }
        }));
    }, []);

    const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
        setGameState(prev => {
            const originalGrid = prev.grid;
            const cellInOriginalGrid = originalGrid[rowIndex]?.[colIndex];

            if (cellInOriginalGrid?.block && !prev.selectedBlock) {
                let newGrid = [...originalGrid.map(row => [...row])];
                const pickedBlock = {
                    ...cellInOriginalGrid.block,
                    id: cellInOriginalGrid.block.id,
                    originalPosition: { row: rowIndex, col: colIndex }
                };
                newGrid[rowIndex][colIndex].block = null;

                let currentMaxRow = -1;
                let currentMaxCol = -1;
                for (let r = 0; r < newGrid.length; r++) {
                    for (let c = 0; c < newGrid[r].length; c++) {
                        if (newGrid[r][c].block) {
                            currentMaxRow = Math.max(currentMaxRow, r);
                            currentMaxCol = Math.max(currentMaxCol, c);
                        }
                    }
                }

                return {
                    ...prev,
                    selectedBlock: pickedBlock,
                    grid: newGrid,
                    placedBlocks: prev.placedBlocks - 1,
                    maxRow: currentMaxRow,
                    maxCol: currentMaxCol
                };
            }

            if (prev.selectedBlock) {
                console.log('Attempting Placement:', {
                    rowIndex,
                    colIndex,
                    selectedBlockId: prev.selectedBlock.id,
                    selectedBlockColor: prev.selectedBlock.color,
                    originalGridDimensions: [originalGrid.length, originalGrid[0]?.length || 0],
                    cellInOriginalGrid_exists: !!cellInOriginalGrid,
                    cellInOriginalGrid_block_exists: !!cellInOriginalGrid?.block,
                    cellInOriginalGrid_block_details: JSON.stringify(cellInOriginalGrid?.block)
                });

                if (cellInOriginalGrid?.block) {
                    console.error('Occupied Cell Check FAILED:', { cellBlock: JSON.stringify(cellInOriginalGrid.block) });
                    showToast("Can't place block on an occupied cell!");
                    return prev;
                }

                const finalMaxRow = Math.max(prev.maxRow, rowIndex);
                const finalMaxCol = Math.max(prev.maxCol, colIndex);

                const finalGridRows = Math.max(finalMaxRow + 1, MIN_GRID_SIZE);
                const finalGridCols = Math.max(finalMaxCol + 1, MIN_GRID_SIZE);

                let newGrid = [...prev.grid.map(row => [...row])];
                let currentRows = newGrid.length;
                let currentCol = currentRows > 0 ? newGrid[0].length : 0;

                if (currentCol < finalGridCols) {
                    const colsToAdd = finalGridCols - currentCol;
                    for (let r = 0; r < currentRows; r++) {
                        for (let i = 0; i < colsToAdd; i++) {
                            newGrid[r].push({ id: uuidv4(), block: null });
                        }
                    }
                    currentCol = finalGridCols;
                }

                if (currentRows < finalGridRows) {
                    const rowsToAdd = finalGridRows - currentRows;
                    for (let i = 0; i < rowsToAdd; i++) {
                        const newRow = Array(currentCol).fill(null).map(() => ({ id: uuidv4(), block: null }));
                        newGrid.push(newRow);
                    }
                }

                const targetCellId = newGrid[rowIndex]?.[colIndex]?.id || uuidv4();
                newGrid[rowIndex][colIndex] = {
                    id: targetCellId,
                    block: { ...prev.selectedBlock, originalPosition: undefined }
                };

                if (prev.selectedBlock.originalPosition) {
                    const { row, col } = prev.selectedBlock.originalPosition;
                    if (row < newGrid.length && col < newGrid[row]?.length) {
                        newGrid[row][col].block = null;
                    } else {
                        console.warn("Original position cell not found after padding", { row, col, finalGridRows, finalGridCols, gridDimensions: [newGrid.length, newGrid[0]?.length] });
                    }
                }

                return {
                    ...prev,
                    selectedBlock: null,
                    grid: newGrid,
                    placedBlocks: prev.placedBlocks + (prev.selectedBlock.originalPosition ? 0 : 1),
                    maxRow: finalMaxRow,
                    maxCol: finalMaxCol
                };
            }

            return prev;
        });
    }, [showToast]);

    const handleSave = useCallback(() => {
        const canvas = document.createElement('canvas');
        const cellSize = 40;
        const padding = 20;
        const gridRows = gameState.grid.length;
        const gridCols = gridRows > 0 ? gameState.grid[0].length : 0;
        canvas.width = gridCols * cellSize + 2 * padding;
        canvas.height = gridRows * cellSize + 2 * padding;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        gameState.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const x = colIndex * cellSize + padding;
                const y = rowIndex * cellSize + padding;

                ctx.fillStyle = cell.block?.color || '#FFFFFF';
                ctx.fillRect(x, y, cellSize, cellSize);

                ctx.strokeStyle = cell.block ? 'rgba(0,0,0,0.2)' : '#e5e7eb';
                ctx.lineWidth = cell.block ? 2 : 1;
                ctx.strokeRect(x, y, cellSize, cellSize);
            });
        });

        const link = document.createElement('a');
        link.download = 'number-blocks.png';
        link.href = canvas.toDataURL('image/png');
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
                maxRow={gameState.maxRow}
                maxCol={gameState.maxCol}
            />

            <div className="flex flex-col items-center gap-2 mt-4">
                <BlockSelector
                    selectedBlock={gameState.selectedBlock}
                    onBlockSelect={handleBlockSelect}
                />

                <button
                    onClick={handleSave}
                    className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    disabled={gameState.placedBlocks === 0}
                >
                    Save as Image
                </button>
            </div>

            {toast.visible && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 z-50">
                    {toast.message}
                </div>
            )}
        </div>
    );
}; 