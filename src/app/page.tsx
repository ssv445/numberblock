'use client';

import { BuildingGrid } from '@/components/BuildingGrid';
import { Block, Position } from '@/types/block';

export default function Home() {
    const handleBlockMoved = (blockId: string, newPosition: Position) => {
        // Handle block movement if needed
    };

    const handleBlockRemoved = (blockId: string) => {
        // Handle block removal if needed
    };

    return (
        <main className="h-full bg-gray-50">
            <div className="main-content">
                <h1 className="text-2xl font-bold p-4">Number Block Builder</h1>
                <div className="building-area p-4 overflow-auto">
                    <div className="mx-auto">
                        <BuildingGrid
                            onBlockMoved={handleBlockMoved}
                            onBlockRemoved={handleBlockRemoved}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 