export interface Position {
    x: number;
    y: number;
}

export interface GridPosition {
    row: number;
    col: number;
}

export interface Block {
    id: string;
    value: number;
    color: string;
    position?: Position;
}

export interface PlacedBlock extends Block {
    position: Position;
}

export interface GridCell {
    block: PlacedBlock | null;
    isValid: boolean;
}

export const GRID_SIZE = 32; // Size of each grid cell in pixels
export const GRID_COLS = 10; // Number of columns in the grid
export const MIN_ROWS = 15; // Minimum number of visible rows

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

export const RAINBOW_COLORS = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8F00FF'  // Violet
];

// Helper functions for grid operations
export const pixelToGrid = (x: number, y: number): GridPosition => ({
    col: Math.floor(x / GRID_SIZE),
    row: Math.floor(y / GRID_SIZE)
});

export const gridToPixel = (row: number, col: number): Position => ({
    x: col * GRID_SIZE + GRID_SIZE / 2,
    y: row * GRID_SIZE + GRID_SIZE / 2
});

export const isValidPosition = (grid: GridCell[][], row: number, col: number): boolean => {
    // Check if position is within grid bounds
    if (row < 0 || col < 0 || col >= GRID_COLS) return false;
    if (row >= grid.length) return false;

    // Position is valid if it's empty or has a block
    return grid[row][col].isValid;
};

export const hasSupport = (grid: GridCell[][], row: number, col: number): boolean => {
    // Block is supported if it's on the bottom row
    if (row === grid.length - 1) return true;

    // Block is supported if there's a block below it
    return grid[row + 1][col].block !== null;
};

export interface BlockHandlers {
    onBlockPlaced: (block: PlacedBlock) => void;
    onBlockRemoved?: (blockId: string) => void;
    onBlockMoved?: (blockId: string, newPosition: Position) => void;
} 