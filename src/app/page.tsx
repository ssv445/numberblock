'use client';

import { BlockPalette } from '@/components/BlockPalette';

export default function Home() {
    return (
        <main className="h-full bg-gray-50">
            <div className="main-content">
                <h1 className="text-4xl font-bold p-4">Number Block Builder</h1>
                <div className="building-area p-4">
                    <h2 className="text-2xl font-bold mb-4">Building Area</h2>
                    <div className="min-h-[800px] border-2 border-dashed border-gray-300 rounded-lg"></div>
                </div>
            </div>
            <BlockPalette />
        </main>
    );
} 