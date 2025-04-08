import Link from 'next/link';

export default function NumberSelector() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Kids Number Blocks Game
            </h1>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <Link
                        key={num}
                        href={`/number/${num}/shape/0`}
                        className="flex items-center justify-center h-16 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold rounded shadow transition-colors"
                    >
                        {num}
                    </Link>
                ))}
            </div>
        </div>
    );
} 