import React from 'react';
import { Message } from './Message';
import { type ChatMessage } from '../types';

interface ChatWindowProps {
    messages: ChatMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    return (
        <div className="space-y-6 px-4">
            {messages.map((msg, index) => (
                <Message key={msg.id + '-' + index} message={msg} />
            ))}
        </div>
    );
};
