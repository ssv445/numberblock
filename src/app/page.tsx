'use client';

import { BlockPalette } from '@/components/BlockPalette';
import { useState } from 'react';
import { Block } from '@/types/block';

export default function Home() {
    const [placedBlocks, setPlacedBlocks] = useState<Block[]>([]);

    const handleBlockDrop = (block: Block, x: number, y: number) => {
        const newBlock = {
            ...block,
            id: `placed-${Date.now()}`, // Ensure unique ID
            position: { x, y }
        };
        setPlacedBlocks([...placedBlocks, newBlock]);
    };

    return (
        <main className="h-full bg-gray-50">
            <div className="main-content">
                <h1 className="text-4xl font-bold p-4">Number Block Builder</h1>
                <div className="building-area p-4">
                    <h2 className="text-2xl font-bold mb-4">Building Area</h2>
                    <div className="min-h-[800px] border-2 border-dashed border-gray-300 rounded-lg relative">
                        {placedBlocks.map((block) => (
                            <div
                                key={block.id}
                                className="absolute w-12 h-12 md:w-14 md:h-14"
                                style={{
                                    left: block.position.x,
                                    top: block.position.y,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <div
                                    className="w-full h-full rounded-lg shadow-md flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: block.color }}
                                >
                                    {block.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <BlockPalette onBlockDrop={handleBlockDrop} />
        </main>
    );
} 