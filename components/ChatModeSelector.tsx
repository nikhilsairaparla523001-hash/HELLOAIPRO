import React from 'react';
import { ChatMode } from '../types';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const ResearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V21" />
    </svg>
);

const DeepThinkIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const CodingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5 0-4.5 16.5" />
    </svg>
);

interface ChatModeSelectorProps {
    currentMode: ChatMode;
    onModeChange: (mode: ChatMode) => void;
    isLoading: boolean;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve 'Cannot find namespace JSX' error.
const modes: { id: ChatMode; name: string; icon: React.ReactNode }[] = [
    { id: 'search', name: 'Search', icon: <SearchIcon /> },
    { id: 'research', name: 'Research', icon: <ResearchIcon /> },
    { id: 'deepthink', name: 'Deep Think', icon: <DeepThinkIcon /> },
    { id: 'coding', name: 'Coding', icon: <CodingIcon /> },
];

export const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({ currentMode, onModeChange, isLoading }) => {
    return (
        <div className="flex justify-center items-center gap-2 mb-3">
            {modes.map(mode => (
                <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    disabled={isLoading}
                    className={`
                        flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                        ${currentMode === mode.id
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    {mode.icon}
                    <span className="hidden sm:inline">{mode.name}</span>
                </button>
            ))}
        </div>
    );
};
