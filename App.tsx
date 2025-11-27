import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { PromptInput } from './components/PromptInput';
import { type ChatMessage, type ChatMode } from './types';
import { generateResponse } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatModeSelector } from './components/ChatModeSelector';

const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [ai, setAi] = useState<GoogleGenAI | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const [chatMode, setChatMode] = useState<ChatMode>('search');
    const chatWindowRef = useRef<HTMLDivElement>(null);

    const getChatConfigForMode = (mode: ChatMode) => {
        switch (mode) {
            case 'research':
                return {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: 'You are a meticulous research assistant. Your goal is to provide comprehensive, well-structured, and detailed answers based on verifiable information. Always cite your sources using Google Search.'
                };
            case 'deepthink':
                return {
                    systemInstruction: 'You are a thoughtful and philosophical assistant. Explore the user\'s prompt from multiple perspectives, offering nuanced insights and fostering deeper understanding. Do not use external tools.'
                };
            case 'coding':
                return {
                    systemInstruction: 'You are an expert software engineer. Your purpose is to provide clean, efficient, and well-documented code. Explain the code clearly and provide usage examples.'
                };
            case 'search':
            default:
                return {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: 'You are a helpful assistant. Use Google Search to answer questions about recent events or provide up-to-date information.'
                };
        }
    };

    useEffect(() => {
        const apiKey = process.env.API_KEY;
        if (apiKey) {
            setAi(new GoogleGenAI({ apiKey }));
        } else {
            console.error("API_KEY environment variable is not set.");
        }
    }, []);

    useEffect(() => {
        if (ai) {
            const config = getChatConfigForMode(chatMode);
            setChat(ai.chats.create({ model: 'gemini-2.5-flash', config }));
            setMessages([]); // Start a new chat visually
        }
    }, [ai, chatMode]);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleNewChat = useCallback(() => {
        if (ai) {
            const config = getChatConfigForMode(chatMode);
            setChat(ai.chats.create({ model: 'gemini-2.5-flash', config }));
            setMessages([]);
        }
    }, [ai, chatMode]);

    const handleModeChange = useCallback((mode: ChatMode) => {
        setChatMode(mode);
    }, []);

    const handleSendPrompt = useCallback(async (prompt: string, file: File | null) => {
        if (!prompt && !file) return;

        const userMessage: ChatMessage = { id: uuidv4(), sender: 'user', text: prompt, file };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        if(file) setUploadProgress(0);

        const aiMessageId = uuidv4();
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '', sources: [] }]);
        
        if (!chat) {
            setIsLoading(false);
            setUploadProgress(null);
            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: `Error: Chat not initialized. Please check your API Key.` } : msg
            ));
            return;
        }

        try {
            await generateResponse(
                prompt,
                file,
                chat,
                (update) => { // onUpdate callback
                     setMessages(prev => prev.map(msg => {
                        if (msg.id === aiMessageId) {
                            const newText = msg.text + (update.text || '');
                            // Sources are sent as a complete list each time, so we can just replace.
                            const newSources = update.sources || msg.sources;
                            return { ...msg, text: newText, sources: newSources };
                        }
                        return msg;
                    }));
                },
                (percent) => setUploadProgress(percent) // onUploadProgress callback
            );
        } catch (error: any) {
            console.error('API Error:', error);
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: `Error: ${errorMessage}` } : msg
            ));
        } finally {
            setIsLoading(false);
            setUploadProgress(null);
        }

    }, [chat]);
    
    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
            <Sidebar onNewChat={handleNewChat} />
            <div className="flex-1 flex flex-col relative">
                <main ref={chatWindowRef} className="flex-1 overflow-y-auto pt-8">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                             <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-cyan-500 rounded-full mb-6 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                             </div>
                             <h1 className="text-2xl font-semibold text-gray-200">How can I help you today?</h1>
                        </div>
                    ) : (
                         <ChatWindow messages={messages} />
                    )}
                </main>
                <div className="w-full px-4 md:px-6 py-4 bg-gray-900">
                     <div className="max-w-3xl mx-auto">
                        <ChatModeSelector currentMode={chatMode} onModeChange={handleModeChange} isLoading={isLoading} />
                        <PromptInput onSend={handleSendPrompt} isLoading={isLoading} uploadProgress={uploadProgress}/>
                        <p className="text-center text-xs text-gray-500 mt-2 px-2">
                           NewGpt.Ai can make mistakes. Consider checking important information.
                        </p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default App;