'use client';

import { Block, COLORS } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

type BlockSelectorProps = {
    selectedBlock: Block | null;
    onBlockSelect: (block: Block) => void;
    layout: 'horizontal' | 'vertical';
};

export const BlockSelector = ({ selectedBlock, onBlockSelect, layout = 'horizontal' }: BlockSelectorProps) => {
    return (
        <div className={`grid ${layout === 'vertical' ? 'grid-cols-3 grid-rows-4 gap-1' : 'grid-cols-10 gap-1'} p-2 bg-gray-100 rounded-lg`}>
            {COLORS.map((color) => {
                const block: Block = {
                    id: uuidv4(),
                    color
                };
                const isSelected = selectedBlock?.color === color;

                return (
                    <div
                        key={block.id}
                        onClick={() => onBlockSelect(block)}
                        className={`
                            relative w-10 h-10 
                            rounded-sm cursor-pointer 
                            transition-all duration-200 
                            transform hover:scale-105
                            shadow-sm
                            ${isSelected ? 'scale-105 animate-rainbow-glow' : ''}
                        `}
                        style={{
                            backgroundColor: color,
                            border: isSelected
                                ? '2px solid transparent'
                                : '2px solid rgba(0,0,0,0.2)'
                        }}
                    >
                        {isSelected && (
                            <div className="absolute inset-[-2px] rounded-sm pointer-events-none animate-rainbow-border" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}; 