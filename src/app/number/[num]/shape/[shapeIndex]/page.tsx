import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlockDisplay from '../../../../../components/BlockDisplay';
import PatternNavigator from '../../../../../components/PatternNavigator';
import { getPattern, getTotalPatternsForNumber } from '../../../../../utils/patterns';

interface Props {
    params: {
        num: string;
        shapeIndex: string;
    };
}

export default async function ShapePage({ params }: Props) {
    const number = parseInt(params.num, 10);
    const shapeIndex = parseInt(params.shapeIndex, 10);

    // Validate parameters
    if (
        isNaN(number) ||
        isNaN(shapeIndex) ||
        number < 1 ||
        number > 20 ||
        shapeIndex < 0
    ) {
        notFound();
    }

    const pattern = getPattern(number, shapeIndex);
    const totalShapes = getTotalPatternsForNumber(number);

    if (!pattern || shapeIndex >= totalShapes) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <Link
                href="/"
                className="inline-block mb-8 text-blue-500 hover:text-blue-600"
            >
                ← Back to Number Selection
            </Link>
            <div className="max-w-2xl mx-auto">
                <BlockDisplay pattern={pattern} number={number} />
                <PatternNavigator
                    currentNumber={number}
                    currentShapeIndex={shapeIndex}
                    totalShapes={totalShapes}
                />
            </div>
        </main>
    );
} 