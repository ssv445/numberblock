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
    maxRow: number;
    maxCol: number;
};

export const INITIAL_GRID_SIZE = 5;
export const MIN_GRID_SIZE = 5;

export const COLORS = [
    '#e41a1d', // Red
    '#f3942b', // Green
    '#e0ce15', // Blue
    '#4fce31', // Yellow
    '#46acca', // Magenta
    '#5729c2', // Cyan
    '#0f0f0f', // Orange
    '#eb27a1', // Purple
    '#a7aaac', // Dark Green
    '#f0f0f0', // Pink
]; 