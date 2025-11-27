import React, { useState, useRef, useCallback } from 'react';

interface PromptInputProps {
    onSend: (prompt: string, file: File | null) => void;
    isLoading: boolean;
    uploadProgress: number | null;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const AttachmentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 1 1 18.374 7.5l-9.19 9.19a2.25 2.25 0 0 1-3.182-3.182l5.486-5.486" />
  </svg>
);


export const PromptInput: React.FC<PromptInputProps> = ({ onSend, isLoading, uploadProgress }) => {
    const [prompt, setPrompt] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUploading = uploadProgress !== null && uploadProgress < 100;

    const handleSend = useCallback(() => {
        if (isLoading || isUploading || (!prompt.trim() && !file)) return;
        onSend(prompt, file);
        setPrompt('');
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [prompt, file, isLoading, isUploading, onSend]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    
    return (
        <div className="bg-gray-800 p-2 rounded-2xl flex items-center gap-2 border border-gray-600 focus-within:border-cyan-500 transition-all">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-cyan-400 rounded-full transition-colors"
                aria-label="Attach file"
                disabled={isLoading || isUploading}
            >
                <AttachmentIcon className="w-6 h-6" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,audio/*,application/pdf"
            />
            <div className="flex-1 relative">
                {file && (
                    <div className="absolute bottom-full left-0 mb-2 bg-gray-700 text-sm text-gray-200 px-2 py-1 rounded-md flex items-center gap-2">
                        <span>{file.name}</span>
                        {isUploading && <span className="text-cyan-400">{uploadProgress}%</span>}
                        <button 
                            onClick={() => {
                                setFile(null);
                                if(fileInputRef.current) fileInputRef.current.value = '';
                            }} 
                            className="ml-2 font-bold text-red-400 hover:text-red-300"
                            disabled={isLoading || isUploading}
                        >
                            ×
                        </button>
                    </div>
                )}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message or upload a file..."
                    className="w-full bg-transparent resize-none focus:outline-none text-gray-100 placeholder-gray-500 pr-2"
                    rows={1}
                    disabled={isLoading || isUploading}
                />
            </div>
            <button
                onClick={handleSend}
                disabled={isLoading || isUploading || (!prompt.trim() && !file)}
                className="p-2 bg-cyan-600 text-white rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
                aria-label="Send message"
            >
                {isLoading || isUploading ? (
                    <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                    <SendIcon className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};