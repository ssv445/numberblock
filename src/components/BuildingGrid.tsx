'use client';

import { useEffect, useRef, useState } from 'react';
import { Block, GridCell, GRID_COLS, GRID_SIZE, MIN_ROWS, PlacedBlock } from '@/types/block';
import { Position, GridPosition } from '@/types/position';
import { BlockSelector } from './BlockSelector';
import { gridToPixel, hasSupport, isValidPosition, pixelToGrid } from '@/utils/grid';

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
    const [placedBlocks, setPlacedBlocks] = useState<Block[]>([]);

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

    const findEmptyCell = (): GridPosition | null => {
        // Start from bottom-up to simulate gravity
        for (let row = grid.length - 1; row >= 0; row--) {
            for (let col = 0; col < GRID_COLS; col++) {
                const pos: GridPosition = { x: col, y: row };
                if (!grid[row][col].block && hasSupport(pos, placedBlocks)) {
                    return pos;
                }
            }
        }
        return null;
    };

    const handleBlockSelect = (block: Block) => {
        const emptyCell = findEmptyCell();
        if (emptyCell) {
            const position = gridToPixel(emptyCell);
            addBlock(block, position);
        }
    };

    const addBlock = (block: Block, position: Position): boolean => {
        const gridPos = pixelToGrid(position);
        if (!gridPos) return false;

        // Check if position is valid
        if (!isValidPosition(gridPos, placedBlocks)) return false;

        // Check if block has support
        if (!hasSupport(gridPos, placedBlocks)) return false;

        // Check if cell is empty
        if (grid[gridPos.y][gridPos.x].block !== null) return false;

        const newGrid = [...grid];
        const placedBlock: PlacedBlock = {
            ...block,
            id: `placed-${Date.now()}`,
            position: gridToPixel(gridPos)
        };
        newGrid[gridPos.y][gridPos.x].block = placedBlock;
        setGrid(newGrid);
        setPlacedBlocks(prev => [...prev, placedBlock]);
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

        const pos: Position = { x, y };
        const gridPos = pixelToGrid(pos);
        if (!gridPos) return;

        // Only proceed if we're within grid bounds
        if (!isValidPosition(gridPos, placedBlocks)) return;

        const oldGridPos = pixelToGrid(selectedBlock.position);
        if (!oldGridPos) return;

        // Don't update if we're in the same cell
        if (oldGridPos.x === gridPos.x && oldGridPos.y === gridPos.y) return;

        // Check if target cell is empty
        if (!grid[gridPos.y][gridPos.x].block) {
            const newPosition = gridToPixel(gridPos);

            const newGrid = [...grid];
            newGrid[oldGridPos.y][oldGridPos.x].block = null;
            const movedBlock = { ...selectedBlock, position: newPosition };
            newGrid[gridPos.y][gridPos.x].block = movedBlock;
            setGrid(newGrid);
            onBlockMoved?.(selectedBlock.id, newPosition);
            setSelectedBlock(movedBlock);

            // Update placed blocks
            setPlacedBlocks(prev =>
                prev.map(b => b.id === selectedBlock.id ? movedBlock : b)
            );
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (selectedBlock) {
            const gridPos = pixelToGrid(selectedBlock.position);
            if (!gridPos) return;

            // If block doesn't have support, move it down until it does
            if (!hasSupport(gridPos, placedBlocks)) {
                let newY = gridPos.y;
                while (newY < grid.length - 1 && !grid[newY + 1][gridPos.x].block) {
                    newY++;
                }

                const newGridPos: GridPosition = { x: gridPos.x, y: newY };
                const newPosition = gridToPixel(newGridPos);

                const newGrid = [...grid];
                newGrid[gridPos.y][gridPos.x].block = null;
                const movedBlock = { ...selectedBlock, position: newPosition };
                newGrid[newY][gridPos.x].block = movedBlock;
                setGrid(newGrid);
                onBlockMoved?.(selectedBlock.id, newPosition);

                // Update placed blocks
                setPlacedBlocks(prev =>
                    prev.map(b => b.id === selectedBlock.id ? movedBlock : b)
                );
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

    const handleDragStart = (e: React.DragEvent) => {
        if (!selectedBlock) return;
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!selectedBlock || !isDragging) return;

        const gridPos = pixelToGrid({ x: e.clientX, y: e.clientY });
        if (!gridPos) return;

        setSelectedBlock(prev => {
            if (!prev) return null;
            return { ...prev, position: gridPos };
        });
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
                                    // e.stopPropagation();
                                    // e.preventDefault();
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