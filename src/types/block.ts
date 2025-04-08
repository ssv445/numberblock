export interface Block {
    id: string;
    value: number;
    color: string;
    position?: Position;
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
    '#FF4136', // Red - 1
    '#FF851B', // Orange - 2
    '#FFDC00', // Yellow - 3
    '#2ECC40', // Green - 4
    '#0074D9', // Blue - 5
    '#4B0082', // Indigo - 6
    '#B10DC9', // Rainbow will be used instead - 7
    '#85144b', // Purple - 8
    '#FFB6C1', // Pink - 9
    '#8B4513'  // Brown - 10
] as const;

// Rainbow colors for number 7
export const RAINBOW_COLORS = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8F00FF'  // Violet
]; 