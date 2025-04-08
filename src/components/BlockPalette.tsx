'use client';

import { Block, BLOCK_COLORS, RAINBOW_COLORS } from '../types/block';
import { useDrag } from 'react-dnd';

interface BlockItemProps {
    block: Block;
    onClick: () => void;
}

const BlockItem = ({ block, onClick }: BlockItemProps) => {
    if (block.value === 7) {
        const stripeHeight = 64 / RAINBOW_COLORS.length;
        return (
            <div
                className="relative w-16 h-16 cursor-pointer"
                onClick={onClick}
            >
                {RAINBOW_COLORS.map((color, index) => (
                    <div
                        key={index}
                        className="absolute w-full"
                        style={{
                            backgroundColor: color,
                            height: `${stripeHeight}px`,
                            top: `${index * stripeHeight}px`,
                        }}
                    />
                ))}
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                    {block.value}
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-16 h-16 flex items-center justify-center text-white font-bold text-2xl cursor-pointer"
            style={{ backgroundColor: block.color }}
            onClick={onClick}
        >
            {block.value}
        </div>
    );
};

export const BlockPalette = () => {
    const blocks: Block[] = BLOCK_COLORS.map((color, index) => ({
        id: `palette-${index + 1}`,
        value: index + 1,
        color,
    }));

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Block Palette</h2>
            <div className="grid grid-cols-5 gap-4">
                {blocks.map((block) => (
                    <BlockItem key={block.id} block={block} onClick={() => { }} />
                ))}
            </div>
        </div>
    );
}; 