'use client';

import { Block } from '../types/block';
import { useDrag, ConnectDragSource } from 'react-dnd';
import { BLOCK_COLORS } from '../types/block';

interface BlockItemProps {
    block: Block;
}

const BlockItem = ({ block }: BlockItemProps) => {
    const [{ isDragging }, drag] = useDrag<Block, void, { isDragging: boolean }>({
        type: 'BLOCK',
        item: block,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag as unknown as React.RefObject<HTMLDivElement>}
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-move ${isDragging ? 'opacity-50' : ''
                }`}
            style={{ backgroundColor: block.color }}
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
                    <BlockItem key={block.id} block={block} />
                ))}
            </div>
        </div>
    );
}; 