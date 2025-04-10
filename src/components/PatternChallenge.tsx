import { useState, useEffect } from 'react';
import { Block, Cell } from '@/types/game';

type Pattern = {
    number: number;
    image: string;
};

type PatternChallengeProps = {
    grid: Cell[][];
    onCellClick: (rowIndex: number, colIndex: number) => void;
    selectedBlock: Block | null;
};

export const PatternChallenge = ({ grid, onCellClick, selectedBlock }: PatternChallengeProps) => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
    const [isViewingPattern, setIsViewingPattern] = useState(false);

    useEffect(() => {
        fetch('/nbimg/numbers.json')
            .then(res => res.json())
            .then(data => setPatterns(data))
            .catch(err => console.error('Error loading patterns:', err));
    }, []);

    const currentPattern = patterns[currentPatternIndex];

    const handleNextPattern = () => {
        setCurrentPatternIndex(prev => (prev + 1) % patterns.length);
    };

    const handlePrevPattern = () => {
        setCurrentPatternIndex(prev => (prev - 1 + patterns.length) % patterns.length);
    };

    const handleRandomPattern = () => {
        const randomIndex = Math.floor(Math.random() * patterns.length);
        setCurrentPatternIndex(randomIndex);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <h3 className="text-lg text-center text-gray-900 mb-2">Inspiration</h3>
            {currentPattern && (
                <div
                    className="relative w-32 h-32 cursor-pointer"
                    onMouseDown={() => setIsViewingPattern(true)}
                    onMouseUp={() => setIsViewingPattern(false)}
                    onMouseLeave={() => setIsViewingPattern(false)}
                    onTouchStart={() => setIsViewingPattern(true)}
                    onTouchEnd={() => setIsViewingPattern(false)}
                >
                    <img
                        src={currentPattern.image}
                        alt={`Pattern ${currentPattern.number}`}
                        className={`w-full h-full object-contain transition-transform duration-200 ${isViewingPattern ? 'fixed inset-4 w-auto h-auto z-50 bg-white p-4 rounded-lg shadow-xl' : ''
                            }`}
                    />
                    <div className="absolute top-0 left-0 bg-gray-800 text-white px-2 py-1 text-sm rounded-br">
                        {currentPattern.number}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevPattern}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                <button
                    onClick={handleRandomPattern}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>

                <button
                    onClick={handleNextPattern}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}; 