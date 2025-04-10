export type Block = {
    id: string;
    color: string;
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

export type Pattern = {
    number: number;
    image: string;
};

export const INITIAL_GRID_SIZE = 10;
export const MIN_GRID_SIZE = 10;

export const COLORS = [
    '#e41a1d', // number 1
    '#f3942b', // number 2
    '#e0ce15', // number 3
    '#4fce31', // number 4
    '#46acca', // number 5
    '#5729c2', // number 6
    '#0f0f0f', // number 7
    '#eb27a1', // number 8
    '#a7aaac', // number 9
    '#f0f0f0', // number 10
];

// Map pattern numbers to their corresponding colors
export const PATTERN_COLOR_MAP: { [key: number]: string } = {
    1: '#e41a1d',
    2: '#f3942b',
    3: '#e0ce15',
    4: '#4fce31',
    5: '#46acca',
    6: '#5729c2',
    7: '#0f0f0f',
    8: '#eb27a1',
    9: '#a7aaac',
    10: '#f0f0f0'
}; 