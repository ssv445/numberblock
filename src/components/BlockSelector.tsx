'use client';

import { Block, BLOCK_COLORS } from '@/types/block';

interface BlockSelectorProps {
    onBlockSelect: (block: Block) => void;
}

export const BlockSelector = ({ onBlockSelect }: BlockSelectorProps) => {
    return (
        <div className="flex flex-col gap-2 p-2 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-3 gap-2">
                {BLOCK_COLORS.map((color, index) => (
                    <button
                        key={index}
                        className="w-12 h-12 rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95"
                        style={{ backgroundColor: color }}
                        onClick={() => onBlockSelect({
                            id: `selector-${index + 1}`,
                            value: index + 1,
                            color: color
                        })}
                    />
                ))}
            </div>
        </div>
    );
}; 