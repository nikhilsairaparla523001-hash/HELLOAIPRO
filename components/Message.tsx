import React, { useEffect, useState, useMemo } from 'react';
import { type ChatMessage, type Source } from '../types';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked to use highlight.js
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

interface MessageProps {
    message: ChatMessage;
    isLoading?: boolean;
    isLastMessage?: boolean;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white flex-shrink-0">
        U
    </div>
);

const AiIcon = () => (
    <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
    </div>
);

const FilePreview: React.FC<{ file: File }> = ({ file }) => {
    const url = useMemo(() => URL.createObjectURL(file), [file]);

    if (file.type.startsWith('image/')) {
        return <img src={url} alt={file.name} className="max-w-xs max-h-64 rounded-lg mt-2" />;
    }
    if (file.type.startsWith('video/')) {
        return <video src={url} controls className="max-w-xs rounded-lg mt-2" />;
    }
    if (file.type.startsWith('audio/')) {
        return <audio src={url} controls className="mt-2" />;
    }
    if (file.type === 'application/pdf') {
        return (
            <div className="mt-2 p-2 bg-gray-700 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="text-sm truncate">{file.name}</span>
            </div>
        );
    }
    return <div className="mt-2 text-sm text-gray-400">File: {file.name}</div>;
};

const Sources: React.FC<{ sources: Source[] }> = ({ sources }) => (
    <div className="mt-4 pt-2 border-t border-gray-700">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
        <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
                <a
                    key={index}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-cyan-400 text-xs px-2 py-1 rounded-md transition-colors truncate"
                    title={source.title}
                >
                    {new URL(source.uri).hostname}
                </a>
            ))}
        </div>
    </div>
);


export const Message: React.FC<MessageProps> = ({ message, isLoading, isLastMessage }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const isError = message.sender === 'ai' && message.text.startsWith('Error:');

    useEffect(() => {
        if (message.sender === 'ai' && message.text) {
             const parseMarkdown = async () => {
                const html = await marked.parse(message.text) as string;
                setHtmlContent(html);
             };
             parseMarkdown();
        } else {
            setHtmlContent('');
        }
    }, [message.text, message.sender]);

    const showTypingIndicator = isLoading && isLastMessage && message.sender === 'ai' && message.text.length === 0;
    const showTypingCursor = isLoading && isLastMessage && message.sender === 'ai' && message.text.length > 0;

    return (
        <div className="max-w-3xl mx-auto flex items-start gap-4">
            <div className="flex-shrink-0">
                {message.sender === 'user' ? <UserIcon /> : <AiIcon />}
            </div>
            <div className="flex-grow pt-1 min-w-0">
                <p className="font-bold text-gray-200">
                    {message.sender === 'user' ? 'You' : 'NewGpt.Ai'}
                </p>

                {message.file && <FilePreview file={message.file} />}

                {message.sender === 'user' ? (
                    <p className="text-gray-200 whitespace-pre-wrap">{message.text}</p>
                ) : (
                    <div className="flex items-center">
                        <div
                            className={`prose prose-invert prose-sm max-w-none ${isError ? 'text-red-400' : ''}`}
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                        {showTypingCursor && (
                            <span className="inline-block w-2 h-5 bg-cyan-400 animate-pulse ml-1" />
                        )}
                    </div>
                )}
                
                {showTypingIndicator && (
                     <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-5 bg-cyan-400 animate-pulse" />
                    </div>
                )}

                {!isLoading && message.sources && message.sources.length > 0 && <Sources sources={message.sources} />}
            </div>
        </div>
    );
};
