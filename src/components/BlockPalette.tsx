'use client';

import { Block, BLOCK_COLORS, RAINBOW_COLORS } from '../types/block';
import { TouchEvent } from 'react';

interface BlockItemProps {
    block: Block;
    onTouchStart: (e: TouchEvent, block: Block) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
}

const BlockItem = ({ block, onTouchStart, onTouchMove, onTouchEnd }: BlockItemProps) => {
    if (block.value === 7) {
        const stripeHeight = 100 / RAINBOW_COLORS.length;
        return (
            <div
                className="w-full h-full relative rounded-lg shadow-md touch-none select-none"
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
                            height: `${stripeHeight}%`,
                            top: `${index * stripeHeight}%`,
                        }}
                    />
                ))}
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg md:text-2xl">
                    {block.value}
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-lg md:text-2xl rounded-lg shadow-md touch-none select-none"
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
    const blocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
        id: `palette-${i + 1}`,
        value: i + 1,
        color: BLOCK_COLORS[i],
    }));

    const handleTouchStart = (e: TouchEvent, block: Block) => {
        e.stopPropagation();
        const touch = e.touches[0];
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        // Create a ghost element
        const ghost = target.cloneNode(true) as HTMLElement;
        ghost.id = 'ghost-block';
        ghost.style.position = 'fixed';
        ghost.style.left = `${touch.clientX - rect.width / 2}px`;
        ghost.style.top = `${touch.clientY - rect.height / 2}px`;
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        ghost.style.opacity = '0.8';
        ghost.style.zIndex = '1000';
        ghost.style.pointerEvents = 'none';
        ghost.style.transform = 'scale(1.1)';
        document.body.appendChild(ghost);
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.stopPropagation();
        const touch = e.touches[0];
        const ghost = document.getElementById('ghost-block');
        if (ghost) {
            ghost.style.left = `${touch.clientX - ghost.offsetWidth / 2}px`;
            ghost.style.top = `${touch.clientY - ghost.offsetHeight / 2}px`;
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        e.stopPropagation();
        const ghost = document.getElementById('ghost-block');
        if (ghost) {
            ghost.style.transition = 'all 0.2s ease-out';
            ghost.style.opacity = '0';
            ghost.style.transform = 'scale(0.8)';
            setTimeout(() => ghost.remove(), 200);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-2 shadow-lg z-50">
            <div className="flex overflow-x-auto pb-2 px-2 hide-scrollbar items-center">
                <div className="flex gap-3 mx-auto px-2">
                    {blocks.map((block) => (
                        <div key={block.id} className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14">
                            <BlockItem
                                block={block}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-safe-area-bottom"></div>
        </div>
    );
}; 