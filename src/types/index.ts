export type Coordinate = {
    x: number;
    y: number;
    value?: number; // The value of the block (for composite numbers)
};

export type BlockPattern = Coordinate[];

export type PatternMap = Record<number, BlockPattern[]>; 