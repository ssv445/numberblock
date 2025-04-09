export type Block = {
    id: string;
    color: string;
    originalPosition?: {
        row: number;
        col: number;
    };
};

export type Cell = {
    id: string;
    block: Block | null;
};

export type GridState = Cell[][];

export type GameState = {
    selectedBlock: Block | null;
    placedBlocks: number;
    grid: GridState;
};

export const GRID_SIZE = 10;

export const COLORS = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#008000', // Dark Green
    '#FFC0CB', // Pink
]; 