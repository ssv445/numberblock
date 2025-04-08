'use client';

import { BlockPalette } from '@/components/BlockPalette';
import { BuildingGrid } from '@/components/BuildingGrid';
import { useState } from 'react';
import { Block, Position } from '@/types/block';

export default function Home() {
    const [placedBlocks, setPlacedBlocks] = useState<Block[]>([]);

    const handleBlockDrop = (block: Block, x: number, y: number) => {
        const newBlock = {
            ...block,
            id: `placed-${Date.now()}`,
            position: { x, y }
        };
        setPlacedBlocks([...placedBlocks, newBlock]);
    };

    const handleBlockMoved = (blockId: string, newPosition: Position) => {
        setPlacedBlocks(blocks =>
            blocks.map(block =>
                block.id === blockId
                    ? { ...block, position: newPosition }
                    : block
            )
        );
    };

    const handleBlockRemoved = (blockId: string) => {
        setPlacedBlocks(blocks => blocks.filter(block => block.id !== blockId));
    };

    return (
        <main className="h-full bg-gray-50">
            <div className="main-content">
                <h1 className="text-2xl font-bold p-4">Number Block Builder</h1>
                <div className="building-area p-4 overflow-auto">
                    <div className="mx-auto">
                        <BuildingGrid
                            onBlockMoved={handleBlockMoved}
                            onBlockRemoved={handleBlockRemoved}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 