'use client';

import { Block, BLOCK_COLORS, RAINBOW_COLORS } from '../types/block';
import { useDrag } from 'react-dnd';
import { TouchEvent } from 'react';

interface BlockItemProps {
    block: Block;
    onTouchStart: (e: TouchEvent, block: Block) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
}

const BlockItem = ({ block, onTouchStart, onTouchMove, onTouchEnd }: BlockItemProps) => {
    if (block.value === 7) {
        const stripeHeight = 64 / RAINBOW_COLORS.length;
        return (
            <div
                className="relative w-16 h-16 touch-none select-none"
                onTouchStart={(e) => onTouchStart(e, block)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
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
            className="w-16 h-16 flex items-center justify-center text-white font-bold text-2xl touch-none select-none"
            style={{ backgroundColor: block.color }}
            onTouchStart={(e) => onTouchStart(e, block)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
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

    const handleTouchStart = (e: TouchEvent, block: Block) => {
        e.preventDefault();
        const touch = e.touches[0];
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();

        // Create a ghost element
        const ghost = target.cloneNode(true) as HTMLElement;
        ghost.id = 'ghost-block';
        ghost.style.position = 'fixed';
        ghost.style.left = `${touch.clientX - rect.width / 2}px`;
        ghost.style.top = `${touch.clientY - rect.height / 2}px`;
        ghost.style.opacity = '0.8';
        ghost.style.zIndex = '1000';
        ghost.style.pointerEvents = 'none';
        document.body.appendChild(ghost);
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        const ghost = document.getElementById('ghost-block');
        if (ghost) {
            ghost.style.left = `${touch.clientX - ghost.offsetWidth / 2}px`;
            ghost.style.top = `${touch.clientY - ghost.offsetHeight / 2}px`;
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        const ghost = document.getElementById('ghost-block');
        if (ghost) {
            ghost.remove();
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Block Palette</h2>
            <div className="grid grid-cols-5 gap-4">
                {blocks.map((block) => (
                    <BlockItem
                        key={block.id}
                        block={block}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                ))}
            </div>
        </div>
    );
}; 