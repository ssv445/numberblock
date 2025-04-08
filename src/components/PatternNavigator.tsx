'use client';

import Link from 'next/link';

interface PatternNavigatorProps {
    currentNumber: number;
    currentShapeIndex: number;
    totalShapes: number;
}

export default function PatternNavigator({
    currentNumber,
    currentShapeIndex,
    totalShapes,
}: PatternNavigatorProps) {
    const prevDisabled = currentShapeIndex === 0;
    const nextDisabled = currentShapeIndex === totalShapes - 1;

    return (
        <div className="flex justify-center gap-4 mt-8">
            {prevDisabled ? (
                <span className="px-4 py-2 rounded bg-gray-300 cursor-not-allowed text-gray-500">
                    Previous Shape
                </span>
            ) : (
                <Link
                    href={`/number/${currentNumber}/shape/${currentShapeIndex - 1}`}
                    className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Previous Shape
                </Link>
            )}
            {nextDisabled ? (
                <span className="px-4 py-2 rounded bg-gray-300 cursor-not-allowed text-gray-500">
                    Next Shape
                </span>
            ) : (
                <Link
                    href={`/number/${currentNumber}/shape/${currentShapeIndex + 1}`}
                    className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Next Shape
                </Link>
            )}
        </div>
    );
} 