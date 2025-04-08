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

export const BLOCK_COLORS = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#9400D3', // Violet
    '#FF1493', // Pink
    '#00FFFF', // Cyan
    '#8B4513', // Brown
] as const; 