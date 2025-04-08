'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import { BlockPalette } from './BlockPalette';
import { BuildingArea } from './BuildingArea';
import { PlacedBlock } from '../types/block';

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

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-4 max-w-[1200px]">
                <h1 className="text-3xl font-bold mb-8 text-center">Number Block Builder</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-[300px] bg-white rounded-lg shadow-lg flex-shrink-0">
                        <BlockPalette />
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