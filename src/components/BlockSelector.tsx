'use client';

import { Block, COLORS } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

type BlockSelectorProps = {
    selectedBlock: Block | null;
    onBlockSelect: (block: Block) => void;
};

export const BlockSelector = ({ selectedBlock, onBlockSelect }: BlockSelectorProps) => {
    return (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded-lg max-w-[600px]">
            {COLORS.map((color) => {
                const block: Block = {
                    id: uuidv4(),
                    color
                };
                const isSelected = selectedBlock?.color === color && !selectedBlock?.originalPosition;

                return (
                    <div
                        key={block.id}
                        onClick={() => onBlockSelect(block)}
                        className={`
                            w-10 h-10 
                            rounded-sm 
                            cursor-pointer 
                            transition-all duration-200 
                            transform hover:scale-105
                            shadow-sm
                            border-2
                            ${isSelected ? 'ring-2 ring-blue-500 scale-105' : ''}
                        `}
                        style={{
                            backgroundColor: color,
                            borderColor: 'rgba(0,0,0,0.2)'
                        }}
                    />
                );
            })}
        </div>
    );
}; 