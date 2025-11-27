import React from 'react';
import { Message } from './Message';
import { type ChatMessage } from '../types';

interface ChatWindowProps {
    messages: ChatMessage[];
    isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
    return (
        <div className="space-y-6 px-4">
            {messages.map((msg, index) => {
                const isLastMessage = index === messages.length - 1;
                return (
                     <Message
                        key={msg.id}
                        message={msg}
                        isLoading={isLoading}
                        isLastMessage={isLastMessage}
                    />
                );
            })}
        </div>
    );
};
