import { Position, GridPosition } from "@/types/position";
import { Block } from "@/types/block";

const CELL_SIZE = 40;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

export function gridToPixel(gridPos: GridPosition): Position {
    return {
        x: gridPos.x * CELL_SIZE,
        y: gridPos.y * CELL_SIZE
    };
}

export function pixelToGrid(pos: Position): GridPosition | null {
    const x = Math.floor(pos.x / CELL_SIZE);
    const y = Math.floor(pos.y / CELL_SIZE);

    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
        return null;
    }

    return { x, y };
}

export function isValidPosition(pos: GridPosition, placedBlocks: Block[]): boolean {
    if (pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) {
        return false;
    }

    return !placedBlocks.some(block => {
        if (!block.position) return false;
        return block.position.x === pos.x && block.position.y === pos.y;
    });
}

export function hasSupport(pos: GridPosition, placedBlocks: Block[]): boolean {
    // Block has support if it's on the ground or has a block below it
    if (pos.y === GRID_HEIGHT - 1) {
        return true;
    }

    return placedBlocks.some(block => {
        if (!block.position) return false;
        return block.position.x === pos.x && block.position.y === pos.y + 1;
    });
} 