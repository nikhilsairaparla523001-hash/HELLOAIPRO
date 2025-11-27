import React, { useState, useEffect, useMemo } from 'react';
import { type ChatMessage } from '../types';
import { marked } from 'marked';

interface MessageProps {
    message: ChatMessage;
}

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white flex-shrink-0">
        U
    </div>
);

const AiIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white flex-shrink-0">
        AI
    </div>
);

const PdfIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-red-400 flex-shrink-0">
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a.375.375 0 0 1-.375-.375V6.75A3.75 3.75 0 0 0 9 3H5.625Z" />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 15.75 1.5h1.875a.375.375 0 0 1 .375.375v4.5a.375.375 0 0 1-.375.375h-4.5a.375.375 0 0 1-.375-.375v-1.125a.375.375 0 0 1 .214-.342l2.582-1.418a.375.375 0 0 0 .16-.317V1.816Z" />
    </svg>
);


const FilePreview: React.FC<{ file: File }> = ({ file }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileType = file.type.split('/')[0];
    const isPdf = file.type === 'application/pdf';

    useEffect(() => {
        let objectUrl: string | null = null;
        if (file && !isPdf) {
            objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file, isPdf]);

    if (fileType === 'image' && previewUrl) {
        return <img src={previewUrl} alt="File preview" className="mt-2 rounded-lg max-w-xs max-h-48 object-cover" />;
    }
    if (fileType === 'video' && previewUrl) {
        return <video src={previewUrl} controls className="mt-2 rounded-lg max-w-xs max-h-60" />;
    }
    if (fileType === 'audio' && previewUrl) {
        return <audio src={previewUrl} controls className="mt-2 w-full max-w-xs" />;
    }
    if (isPdf) {
        return (
            <div className="mt-2 p-3 rounded-lg bg-gray-700/50 flex items-center gap-3 max-w-xs border border-gray-600">
                <PdfIcon />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</p>
                </div>
            </div>
        );
    }
    return null;
};


export const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.sender === 'user';
    
    const parsedHtml = useMemo(() => 
        marked.parse(message.text || '', { gfm: true, breaks: true })
    , [message.text]);

    return (
        <div className="max-w-3xl mx-auto flex gap-4 items-start">
            <div className="flex-shrink-0">
                {isUser ? <UserIcon /> : <AiIcon />}
            </div>
            <div className={`flex-1 pt-1 overflow-x-auto`}>
                <div className="font-bold mb-1">{isUser ? "You" : "NewGpt.Ai"}</div>
                {message.file && <FilePreview file={message.file} />}
                <div
                    className="prose prose-invert max-w-none prose-p:my-2 prose-headings:my-3" 
                    dangerouslySetInnerHTML={{ __html: parsedHtml as string }}
                />
                {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 border-t border-gray-700 pt-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8.5 2a.5.5 0 0 0-1 0v8.25a.75.75 0 0 1-1.5 0V3.5a2 2 0 1 0-4 0v9.5A3.5 3.5 0 0 0 5.5 16.5a3.5 3.5 0 0 0 3.5-3.5V2ZM5 3.5a.5.5 0 0 0-1 0v9.5a2 2 0 0 0 2 2 .5.5 0 0 1 0-1 1 1 0 0 1-1-1V3.5Z" clipRule="evenodd" />
                            </svg>
                            Sources
                        </h4>
                        <ol className="list-none p-0 m-0 space-y-2">
                            {message.sources.map((source, index) => (
                                <li key={index} className="flex items-start text-sm gap-2">
                                    <span className="bg-gray-700 text-gray-300 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-xs">{index + 1}</span>
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline break-all" title={source.title}>
                                        {source.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
};