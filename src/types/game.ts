import Color from 'color';

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

export const NORMAL_COLORS = [
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

export const getLightColor = (hexColor: string, lightness: number): string => {
    return Color(hexColor).lighten(lightness / 100).hex();
};

export const COLORS = NORMAL_COLORS.map(color => [color, getLightColor(color, 40), getLightColor(color, 70)]).flat();