export type Coordinate = {
    x: number;
    y: number;
};

export type BlockPattern = Coordinate[];

export type PatternMap = Record<number, BlockPattern[]>; 