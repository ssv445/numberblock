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
    const longPressTimer = useRef<NodeJS.Timeout>();
    const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });

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
        e.stopPropagation();
        setSelectedBlock(block);

        // Start long press timer
        longPressTimer.current = setTimeout(() => {
            const { row, col } = pixelToGrid(block.position.x, block.position.y);
            if (confirm('Delete this block?')) {
                removeBlock(row, col);
            }
        }, 500); // 500ms for long press

        if (gridRef.current) {
            const rect = gridRef.current.getBoundingClientRect();
            setScrollOffset({
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
            });
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        // Clear long press timer on move
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }

        if (!selectedBlock || !isDragging) {
            setIsDragging(true);
            return;
        }

        e.stopPropagation();

        const touch = e.touches[0];
        const { row, col } = pixelToGrid(
            touch.clientX - scrollOffset.x,
            touch.clientY - scrollOffset.y
        );

        if (isValidPosition(grid, row, col) && hasSupport(grid, row, col)) {
            const newPosition = gridToPixel(row, col);
            const oldPos = pixelToGrid(selectedBlock.position.x, selectedBlock.position.y);

            // Only update if position changed and target cell is empty
            if ((oldPos.row !== row || oldPos.col !== col) && !grid[row][col].block) {
                const newGrid = [...grid];
                newGrid[oldPos.row][oldPos.col].block = null;
                const movedBlock = { ...selectedBlock, position: newPosition };
                newGrid[row][col].block = movedBlock;
                setGrid(newGrid);
                onBlockMoved?.(selectedBlock.id, newPosition);
                setSelectedBlock(movedBlock);
            }
        }
    };

    const handleTouchEnd = () => {
        // Clear long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        setSelectedBlock(null);
        setIsDragging(false);
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
                        maxHeight: 'calc(100vh - 120px)'
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
                                className={`absolute touch-none transition-transform ${isDragging && selectedBlock?.id === cell.block.id ? 'scale-110' : ''}`}
                                style={{
                                    width: `${GRID_SIZE}px`,
                                    height: `${GRID_SIZE}px`,
                                    transform: `translate(${colIndex * GRID_SIZE}px, ${rowIndex * GRID_SIZE}px)`,
                                }}
                                onTouchStart={(e) => handleTouchStart(e, cell.block!)}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
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