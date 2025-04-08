'use client';

import { Block, PlacedBlock } from '@/types/block';
import { Position } from '@/types/position';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import { BlockPalette } from './BlockPalette';
import { BuildingArea } from './BuildingArea';

const pixelToGrid = (x: number, y: number): Position => {
    const cellSize = 40; // This should match your grid cell size
    return {
        x: Math.floor(x / cellSize),
        y: Math.floor(y / cellSize)
    };
};

const isValidPosition = (position: Position): boolean => {
    const gridWidth = 10; // This should match your grid width
    const gridHeight = 10; // This should match your grid height
    return position.x >= 0 && position.x < gridWidth &&
        position.y >= 0 && position.y < gridHeight;
};

export const NumberBlockGame = () => {
    const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);

    const handleBlockPlaced = (block: PlacedBlock) => {
        setPlacedBlocks((prev) => [...prev, block]);
    };

    const handleBlockRemoved = (blockId: string) => {
        setPlacedBlocks((prev) => prev.filter(block => block.id !== blockId));
    };

    const handleBlockMoved = (blockId: string, newPosition: { x: number; y: number }) => {
        setPlacedBlocks((prev) =>
            prev.map(block =>
                block.id === blockId
                    ? { ...block, position: newPosition }
                    : block
            )
        );
    };

    const handleBlockDrop = (block: Block, x: number, y: number) => {
        const gridPosition = pixelToGrid(x, y);
        if (isValidPosition(gridPosition)) {
            const newBlock = {
                ...block,
                id: `block-${Date.now()}`,
                position: gridPosition
            };
            setPlacedBlocks(prev => [...prev, newBlock]);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-4 max-w-[1200px]">
                <h1 className="text-3xl font-bold mb-8 text-center">Number Block Builder</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-[300px] bg-white rounded-lg shadow-lg flex-shrink-0">
                        <BlockPalette onBlockDrop={handleBlockDrop} />
                    </div>
                    <div className="flex-grow bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
                        <h2 className="text-xl font-bold mb-4">Building Area</h2>
                        <BuildingArea
                            onBlockPlaced={handleBlockPlaced}
                            placedBlocks={placedBlocks}
                            onBlockRemoved={handleBlockRemoved}
                            onBlockMoved={handleBlockMoved}
                        />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}; 