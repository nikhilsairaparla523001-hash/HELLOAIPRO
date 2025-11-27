import React from 'react';

const NewChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
);

const MOCKED_HISTORY = [
    "Exploring Quantum Physics",
    "React vs. Svelte in 2024",
    "Creative Dinner Recipes",
    "Debugging Python Scripts",
];

interface SidebarProps {
    onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
    return (
        <aside className="w-64 bg-gray-800 p-2 flex-col border-r border-gray-700 hidden md:flex">
             <div className="p-2 mb-4">
                 <h1 className="text-xl font-bold text-cyan-400">
                    NewGpt<span className="text-white">.Ai</span>
                </h1>
            </div>
            <button
                onClick={onNewChat}
                className="flex items-center gap-3 p-3 text-sm font-medium text-white rounded-md hover:bg-gray-700 transition-colors w-full"
            >
                <NewChatIcon className="w-5 h-5" />
                <span>New Chat</span>
            </button>
            <div className="mt-6 flex-1 overflow-y-auto" aria-label="Chat history">
                <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">History</h2>
                <ul className="space-y-1">
                   {MOCKED_HISTORY.map((item, index) => (
                       <li key={index}>
                           <a href="#" className="flex items-center gap-3 p-3 text-sm text-gray-300 rounded-md hover:bg-gray-700 transition-colors">
                               <HistoryIcon className="w-5 h-5 flex-shrink-0 text-gray-500" />
                               <span className="truncate">{item}</span>
                           </a>
                       </li>
                   ))}
                </ul>
            </div>
            <div className="mt-auto border-t border-gray-700 p-2">
                 <a href="#" className="flex items-center gap-3 p-2 text-sm text-white rounded-md hover:bg-gray-700">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white flex-shrink-0">
                        U
                    </div>
                    <span className="font-medium">User Profile</span>
                 </a>
            </div>
        </aside>
    );
};
