'use client';

import { useEffect, useRef, useState } from 'react';
import { Block, GridCell, GRID_COLS, GRID_SIZE, MIN_ROWS, PlacedBlock, Position, gridToPixel, hasSupport, isValidPosition, pixelToGrid } from '@/types/block';
import { BlockSelector } from './BlockSelector';

interface BuildingGridProps {
    onBlockMoved?: (blockId: string, newPosition: Position) => void;
    onBlockRemoved?: (blockId: string) => void;
}

export const BuildingGrid = ({ onBlockMoved, onBlockRemoved }: BuildingGridProps) => {
    const [grid, setGrid] = useState<GridCell[][]>([]);
    const [rows, setRows] = useState(MIN_ROWS);
    const gridRef = useRef<HTMLDivElement>(null);
    const [selectedBlock, setSelectedBlock] = useState<PlacedBlock | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);

    // Initialize grid
    useEffect(() => {
        const newGrid = Array(rows).fill(null).map(() =>
            Array(GRID_COLS).fill(null).map(() => ({
                block: null,
                isValid: true
            }))
        );
        setGrid(newGrid);
    }, [rows]);

    const findEmptyCell = (): { row: number; col: number } | null => {
        // Start from bottom-up to simulate gravity
        for (let row = grid.length - 1; row >= 0; row--) {
            for (let col = 0; col < GRID_COLS; col++) {
                if (!grid[row][col].block && hasSupport(grid, row, col)) {
                    return { row, col };
                }
            }
        }
        return null;
    };

    const handleBlockSelect = (block: Block) => {
        const emptyCell = findEmptyCell();
        if (emptyCell) {
            const position = gridToPixel(emptyCell.row, emptyCell.col);
            addBlock(block, position);
        }
    };

    const addBlock = (block: Block, position: Position) => {
        const { row, col } = pixelToGrid(position.x, position.y);

        // Check if position is valid
        if (!isValidPosition(grid, row, col)) return false;

        // Check if block has support
        if (!hasSupport(grid, row, col)) return false;

        // Check if cell is empty
        if (grid[row][col].block !== null) return false;

        const newGrid = [...grid];
        const placedBlock: PlacedBlock = {
            ...block,
            id: `placed-${Date.now()}`,
            position: gridToPixel(row, col)
        };
        newGrid[row][col].block = placedBlock;
        setGrid(newGrid);
        return true;
    };

    const handleTouchStart = (e: React.TouchEvent, block: PlacedBlock) => {
        const touch = e.touches[0];
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        setSelectedBlock(block);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!selectedBlock || !gridRef.current) return;

        const touch = e.touches[0];
        const rect = gridRef.current.getBoundingClientRect();

        // Calculate position relative to grid
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        // Get target grid position
        const { row, col } = pixelToGrid(x, y);

        // Only proceed if we're within grid bounds
        if (!isValidPosition(grid, row, col)) return;

        const oldPos = pixelToGrid(selectedBlock.position.x, selectedBlock.position.y);

        // Don't update if we're in the same cell
        if (oldPos.row === row && oldPos.col === col) return;

        // Check if target cell is empty
        if (!grid[row][col].block) {
            const newPosition = {
                x: col * GRID_SIZE,
                y: row * GRID_SIZE
            };

            const newGrid = [...grid];
            newGrid[oldPos.row][oldPos.col].block = null;
            const movedBlock = { ...selectedBlock, position: newPosition };
            newGrid[row][col].block = movedBlock;
            setGrid(newGrid);
            onBlockMoved?.(selectedBlock.id, newPosition);
            setSelectedBlock(movedBlock);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (selectedBlock) {
            const { row, col } = pixelToGrid(selectedBlock.position.x, selectedBlock.position.y);

            // If block doesn't have support, move it down until it does
            if (!hasSupport(grid, row, col)) {
                let newRow = row;
                while (newRow < grid.length - 1 && !grid[newRow + 1][col].block) {
                    newRow++;
                }

                const newPosition = {
                    x: col * GRID_SIZE,
                    y: newRow * GRID_SIZE
                };

                const newGrid = [...grid];
                newGrid[row][col].block = null;
                const movedBlock = { ...selectedBlock, position: newPosition };
                newGrid[newRow][col].block = movedBlock;
                setGrid(newGrid);
                onBlockMoved?.(selectedBlock.id, newPosition);
            }
        }

        setSelectedBlock(null);
        setIsDragging(false);
        touchStartPos.current = null;
    };

    const removeBlock = (row: number, col: number) => {
        if (!grid[row][col].block) return;
        const blockId = grid[row][col].block!.id;
        const newGrid = [...grid];
        newGrid[row][col].block = null;
        setGrid(newGrid);
        onBlockRemoved?.(blockId);
    };

    return (
        <div className="relative flex flex-col h-screen">
            <div className="flex-1 overflow-auto">
                <div
                    ref={gridRef}
                    className="relative mx-auto bg-white rounded-lg border-2 border-dashed border-gray-300"
                    style={{
                        height: `${rows * GRID_SIZE}px`,
                        width: `${GRID_COLS * GRID_SIZE}px`,
                        maxWidth: '100%',
                        maxHeight: 'calc(100vh - 120px)',
                        touchAction: 'none'
                    }}
                >
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                        {Array(rows).fill(null).map((_, row) => (
                            <div key={row} className="absolute w-full border-t border-gray-100"
                                style={{ top: `${row * GRID_SIZE}px` }} />
                        ))}
                        {Array(GRID_COLS).fill(null).map((_, col) => (
                            <div key={col} className="absolute h-full border-l border-gray-100"
                                style={{ left: `${col * GRID_SIZE}px` }} />
                        ))}
                    </div>

                    {/* Blocks */}
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => cell.block && (
                            <div
                                key={cell.block.id}
                                className={`absolute touch-none transition-transform ${isDragging && selectedBlock?.id === cell.block.id ? 'scale-110 z-10' : ''}`}
                                style={{
                                    width: `${GRID_SIZE}px`,
                                    height: `${GRID_SIZE}px`,
                                    transform: `translate(${colIndex * GRID_SIZE}px, ${rowIndex * GRID_SIZE}px)`,
                                }}
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleTouchStart(e, cell.block!);
                                }}
                                onTouchMove={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleTouchMove(e);
                                }}
                                onTouchEnd={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleTouchEnd(e);
                                }}
                            >
                                <div
                                    className="w-full h-full rounded-lg shadow-md"
                                    style={{ backgroundColor: cell.block.color }}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="fixed bottom-4 right-4 z-50">
                <BlockSelector onBlockSelect={handleBlockSelect} />
            </div>
        </div>
    );
}; 