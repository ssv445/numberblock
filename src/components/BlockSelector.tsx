'use client';

import { useState } from 'react';
import { Block, BLOCK_COLORS } from '@/types/block';

interface BlockSelectorProps {
    onBlockSelect: (block: Block) => void;
}

export const BlockSelector = ({ onBlockSelect }: BlockSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const blocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
        id: `selector-${i + 1}`,
        value: i + 1,
        color: BLOCK_COLORS[i],
    }));

    const handleBlockClick = (block: Block) => {
        onBlockSelect(block);
        setIsOpen(false);
    };

    return (
        <div className="fixed right-4 bottom-24 z-50">
            {/* Blocks dropdown */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="max-h-[60vh] overflow-y-auto">
                        {blocks.map((block) => (
                            <button
                                key={block.id}
                                className="w-full h-14 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
                                onClick={() => handleBlockClick(block)}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg shadow-md flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: block.color }}
                                >
                                    {block.value}
                                </div>
                                <span className="font-medium text-gray-700">Block {block.value}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* FAB button */}
            <button
                className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '×' : '+'}
            </button>
        </div>
    );
}; 