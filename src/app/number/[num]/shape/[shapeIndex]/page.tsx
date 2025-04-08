import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlockDisplay from '../../../../../components/BlockDisplay';
import PatternNavigator from '../../../../../components/PatternNavigator';
import { getPattern, getTotalPatternsForNumber } from '../../../../../utils/patterns';
import { Suspense } from 'react';

interface Props {
    params: {
        num: string;
        shapeIndex: string;
    };
}

async function ShapeContent({ num, shapeIndex }: { num: number; shapeIndex: number }) {
    // Validate parameters
    if (
        isNaN(num) ||
        isNaN(shapeIndex) ||
        num < 1 ||
        num > 20 ||
        shapeIndex < 0
    ) {
        notFound();
    }

    const pattern = getPattern(num, shapeIndex);
    const totalShapes = getTotalPatternsForNumber(num);

    if (!pattern || shapeIndex >= totalShapes) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <BlockDisplay pattern={pattern} number={num} />
            <PatternNavigator
                currentNumber={num}
                currentShapeIndex={shapeIndex}
                totalShapes={totalShapes}
            />
        </div>
    );
}

export default async function ShapePage({ params }: Props) {
    const number = Number(await params.num);
    const shapeIndex = Number(await params.shapeIndex);

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <Link
                href="/"
                className="inline-block mb-8 text-blue-500 hover:text-blue-600"
            >
                ← Back to Number Selection
            </Link>
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            }>
                <ShapeContent num={number} shapeIndex={shapeIndex} />
            </Suspense>
        </main>
    );
} 