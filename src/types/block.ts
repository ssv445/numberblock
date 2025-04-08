export interface Block {
    id: string;
    value: number;
    color: string;
}

export interface Position {
    x: number;
    y: number;
}

export interface PlacedBlock extends Block {
    position: Position;
}

export interface BlockHandlers {
    onBlockPlaced: (block: PlacedBlock) => void;
    onBlockRemoved?: (blockId: string) => void;
    onBlockMoved?: (blockId: string, newPosition: Position) => void;
}

// Colors from Numberblocks 1-10
export const BLOCK_COLORS = [
    '#FF0000', // Red - 1
    '#FFA500', // Orange - 2
    '#FFFF00', // Yellow - 3
    '#008000', // Green - 4
    '#0000FF', // Blue - 5
    '#4B0082', // Indigo - 6
    '#EE82EE', // Violet - 7
    '#800080', // Purple - 8
    '#FFC0CB', // Pink - 9
    '#A52A2A', // Brown - 10
] as const;

// Rainbow colors for number 7
export const RAINBOW_COLORS = [
    '#FF0000', // Red
    '#FFA500', // Orange
    '#FFFF00', // Yellow
    '#008000', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#EE82EE', // Violet
]; 