'use client';

import { useState, useCallback, useEffect } from 'react';
import { Grid } from './Grid';
import { BlockSelector } from './BlockSelector';
import { Block, Cell, GameState, INITIAL_GRID_SIZE, MIN_GRID_SIZE, COLORS } from '@/types/game';
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

    const [counterColor, setCounterColor] = useState(COLORS[0]);

    const [showInstructions, setShowInstructions] = useState(false);

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

    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        return COLORS[randomIndex];
    };

    const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
        const cell = gameState.grid[rowIndex]?.[colIndex]; // Read current cell state directly

        // Determine action based on cell state first
        if (cell?.block) {
            // Action: Remove block
            setGameState(prev => {
                const grid = prev.grid;
                const newGrid = [...grid.map(row => [...row])];
                newGrid[rowIndex][colIndex].block = null; // Remove block

                // Recalculate maxRow and maxCol after removal
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
                    selectedBlock: null, // Also clear selected block from palette if any was held
                    grid: newGrid,
                    placedBlocks: prev.placedBlocks - 1, // Decrement counter
                    maxRow: currentMaxRow,
                    maxCol: currentMaxCol
                };
            });
            setCounterColor(getRandomColor()); // Call this *after* initiating the game state update

        } else if (gameState.selectedBlock) {
            // Action: Place block (only if a block is selected)
            const blockToPlace = gameState.selectedBlock; // Capture the non-null block here
            setGameState(prev => {
                // No need to re-read grid/cell, already know it's empty and selectedBlock exists
                const grid = prev.grid;
                const newGrid = [...grid.map(row => [...row])];

                // Expand grid if necessary
                const finalMaxRow = Math.max(prev.maxRow, rowIndex);
                const finalMaxCol = Math.max(prev.maxCol, colIndex);
                const finalGridRows = Math.max(finalMaxRow + 1, MIN_GRID_SIZE);
                const finalGridCols = Math.max(finalMaxCol + 1, MIN_GRID_SIZE);

                const currentRows = newGrid.length;
                const currentCol = currentRows > 0 ? newGrid[0].length : 0;

                // Add columns if needed
                if (currentCol < finalGridCols) {
                    const colsToAdd = finalGridCols - currentCol;
                    for (let r = 0; r < currentRows; r++) {
                        for (let i = 0; i < colsToAdd; i++) {
                            newGrid[r].push({ id: uuidv4(), block: null });
                        }
                    }
                }

                // Add rows if needed
                if (currentRows < finalGridRows) {
                    const rowsToAdd = finalGridRows - currentRows;
                    for (let i = 0; i < rowsToAdd; i++) {
                        const newRow = Array(finalGridCols).fill(null).map(() => ({ id: uuidv4(), block: null }));
                        newGrid.push(newRow);
                    }
                }

                // Place the block
                const targetCellId = newGrid[rowIndex]?.[colIndex]?.id || uuidv4();
                newGrid[rowIndex][colIndex] = {
                    id: targetCellId,
                    block: {
                        id: blockToPlace.id,
                        color: blockToPlace.color
                    }
                };

                return {
                    ...prev,
                    selectedBlock: null, // Clear selected block
                    grid: newGrid,
                    placedBlocks: prev.placedBlocks + 1, // Increment counter
                    maxRow: finalMaxRow,
                    maxCol: finalMaxCol
                };
            });
            setCounterColor(getRandomColor()); // Call this *after* initiating the game state update
        }
        // Else: Clicked empty cell with no block selected - do nothing

    }, [gameState.grid, gameState.selectedBlock]); // Add dependencies used outside setGameState

    const handleSave = useCallback(() => {
        const rowsToRender = Math.max(gameState.maxRow + 1, MIN_GRID_SIZE);
        const colsToRender = Math.max(gameState.maxCol + 1, MIN_GRID_SIZE);

        const canvas = document.createElement('canvas');
        const cellSize = 40;
        const padding = 20;
        canvas.width = colsToRender * cellSize + 2 * padding;
        canvas.height = rowsToRender * cellSize + 2 * padding;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#f3f4f6'; // Background color for padding
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let rowIndex = 0; rowIndex < rowsToRender; rowIndex++) {
            for (let colIndex = 0; colIndex < colsToRender; colIndex++) {
                const cell = gameState.grid[rowIndex]?.[colIndex];
                const x = colIndex * cellSize + padding;
                const y = rowIndex * cellSize + padding;

                ctx.fillStyle = cell?.block?.color || '#FFFFFF'; // White for empty cells
                ctx.fillRect(x, y, cellSize, cellSize);

                ctx.strokeStyle = cell?.block ? 'rgba(0,0,0,0.2)' : '#e5e7eb'; // Grid lines
                ctx.lineWidth = cell?.block ? 2 : 1;
                ctx.strokeRect(x, y, cellSize, cellSize);
            }
        }

        const link = document.createElement('a');
        link.download = 'number-blocks.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, [gameState.grid, gameState.maxRow, gameState.maxCol]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div className="relative w-full flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-800">NumberBlocks Game</h1>
                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-full text-2xl font-bold text-white transition-colors duration-200"
                        style={{
                            backgroundColor: counterColor,
                            border: '2px solid rgba(0,0,0,0.2)'
                        }}
                    >
                        {gameState.placedBlocks}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={gameState.placedBlocks === 0}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Save as Image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </button>
                </div>
            </div>

            <Grid
                grid={gameState.grid}
                onCellClick={handleCellClick}
                selectedBlock={gameState.selectedBlock}
                maxRow={gameState.maxRow}
                maxCol={gameState.maxCol}
            />

            <p className="text-gray-500 text-sm italic mb-4">
                {gameState.selectedBlock
                    ? "Click any empty cell to place the block"
                    : "Select a color block from below"
                }
            </p>

            <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <BlockSelector
                    selectedBlock={gameState.selectedBlock}
                    onBlockSelect={handleBlockSelect}
                />

                <button
                    onClick={() => setShowInstructions(prev => !prev)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transform transition-transform duration-200 ${showInstructions ? 'rotate-180' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    How to Play
                </button>

                {showInstructions && (
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 w-full">
                        <h3 className="font-bold text-gray-800 mb-2">How to Play Number Blocks</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">1.</span>
                                <span>Select a colored block from the palette below the grid.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">2.</span>
                                <span>Click any empty cell in the grid to place the selected block.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">3.</span>
                                <span>The grid will automatically expand when you place blocks near the edges.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">4.</span>
                                <span>To remove a block, simply click on it in the grid. The block counter will decrease.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">5.</span>
                                <span>Use the save button (↓) in the top-right to save your creation as an image.</span>
                            </li>
                        </ul>
                        <p className="mt-3 text-xs text-gray-500 italic">
                            Tip: The counter in the top-right shows how many blocks you've placed and changes color with each placement!
                        </p>
                    </div>
                )}
            </div>

            {toast.visible && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 z-50">
                    {toast.message}
                </div>
            )}
        </div>
    );
}; 