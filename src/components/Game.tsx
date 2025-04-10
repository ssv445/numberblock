'use client';

import { useState, useCallback, useEffect } from 'react';
import { Grid } from './Grid';
import { BlockSelector } from './BlockSelector';
import { Block, Cell, GameState, INITIAL_GRID_SIZE, MIN_GRID_SIZE, COLORS } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';
import { PatternChallenge } from './PatternChallenge';

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

    const [isSaving, setIsSaving] = useState(false);

    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const [isPatternMode, setIsPatternMode] = useState(false);

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
                    grid: newGrid,
                    placedBlocks: prev.placedBlocks - 1,
                    maxRow: currentMaxRow,
                    maxCol: currentMaxCol
                };
            });
        } else if (gameState.selectedBlock) {
            // Action: Place block
            const blockToPlace = gameState.selectedBlock;
            const targetCellId = cell?.id || uuidv4();

            setGameState(prev => {
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
                    grid: newGrid,
                    placedBlocks: prev.placedBlocks + 1,
                    maxRow: finalMaxRow,
                    maxCol: finalMaxCol
                };
            });
        }
        // Else: Clicked empty cell with no block selected - do nothing

    }, [gameState.grid, gameState.selectedBlock]); // Add dependencies used outside setGameState

    const handleSave = useCallback(async () => {
        try {
            setIsSaving(true);
            const rowsToRender = Math.max(gameState.maxRow + 1, MIN_GRID_SIZE);
            const colsToRender = Math.max(gameState.maxCol + 1, MIN_GRID_SIZE);

            const canvas = document.createElement('canvas');
            const cellSize = 40;
            const padding = 20;
            const headerHeight = 40; // Height for the block count text
            canvas.width = colsToRender * cellSize + 2 * padding;
            canvas.height = rowsToRender * cellSize + 2 * padding + headerHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                showToast('Failed to create canvas context');
                return;
            }

            // Set background
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw block count text
            ctx.font = 'bold 36px "Comic Sans MS", cursive';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';

            const text = `${gameState.placedBlocks}`;
            const textX = canvas.width / 2;
            const textY = headerHeight / 2;
            ctx.fillText(text, textX, textY);
            ctx.strokeText(text, textX, textY);

            // Draw grid
            for (let rowIndex = 0; rowIndex < rowsToRender; rowIndex++) {
                for (let colIndex = 0; colIndex < colsToRender; colIndex++) {
                    const cell = gameState.grid[rowIndex]?.[colIndex];
                    const x = colIndex * cellSize + padding;
                    const y = rowIndex * cellSize + padding + headerHeight; // Add headerHeight offset

                    ctx.fillStyle = cell?.block?.color || '#FFFFFF';
                    ctx.fillRect(x, y, cellSize, cellSize);

                    ctx.strokeStyle = cell?.block ? 'rgba(0,0,0,0.2)' : '#FFFFFF';
                    ctx.lineWidth = cell?.block ? 2 : 1;
                    ctx.strokeRect(x, y, cellSize, cellSize);
                }
            }

            // Generate random number for filename
            const randomNum = Math.floor(Math.random() * 10000);
            const filename = `number-blocks-${gameState.placedBlocks}-${randomNum}.png`;

            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('Image saved successfully!');
        } catch (error) {
            showToast('Failed to save image');
            console.error('Error saving image:', error);
        } finally {
            setIsSaving(false);
        }
    }, [gameState.grid, gameState.maxRow, gameState.maxCol, gameState.placedBlocks, counterColor, showToast]);

    const handleReset = useCallback(() => {
        setShowResetConfirm(true);
    }, []);

    const confirmReset = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            selectedBlock: null,
            placedBlocks: 0,
            grid: createEmptyGrid(INITIAL_GRID_SIZE),
            maxRow: -1,
            maxCol: -1
        }));
        setCounterColor(COLORS[0]);
        setShowResetConfirm(false);
    }, []);

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-full flex items-center justify-between px-4 py-2">
                <button
                    onClick={handleReset}
                    disabled={gameState.placedBlocks === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Reset Grid"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                </button>

                <h1 className="text-large text-gray-800 absolute left-1/2 transform -translate-x-1/2">NumberBlocks Game</h1>


                <button
                    onClick={handleSave}
                    disabled={gameState.placedBlocks === 0 || isSaving}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
                    title="Save as Image"
                >
                    {isSaving ? (
                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    )}
                </button>
            </div>



            <Grid
                grid={gameState.grid}
                onCellClick={handleCellClick}
                selectedBlock={gameState.selectedBlock}
                maxRow={gameState.maxRow}
                maxCol={gameState.maxCol}
                placedBlocks={gameState.placedBlocks}
                counterColor={counterColor}
            />


            <div className="flex justify-between w-full mt-4 px-4">
                <div className="w-5/12">
                    <BlockSelector
                        selectedBlock={gameState.selectedBlock}
                        onBlockSelect={handleBlockSelect}
                        layout="vertical"
                    />
                </div>

                <div className="w-5/12 flex justify-end">
                    <PatternChallenge
                        grid={gameState.grid}
                        onCellClick={handleCellClick}
                        selectedBlock={gameState.selectedBlock}
                    />
                </div>
            </div>

            <div className="w-full flex justify-center mt-4">
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
            </div>

            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl">
                        <h3 className="font-bold text-gray-800 mb-2">How to Play Number Blocks</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">1.</span>
                                <span>Select a colored block from the palette on the left.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">2.</span>
                                <span>Click any empty cell in the grid to place the selected block.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">3.</span>
                                <span>Try to recreate the pattern shown on the right.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">4.</span>
                                <span>To remove a block, simply click on it in the grid.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-medium text-blue-500">5.</span>
                                <span>Use the save button (↓) to save your creation as an image.</span>
                            </li>
                        </ul>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.visible && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 z-50">
                    {toast.message}
                </div>
            )}

            {showResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Reset Grid?</h3>
                        <p className="text-gray-600 mb-6">
                            This will remove all blocks and reset the counter. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReset}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 