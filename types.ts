export type MessageSender = 'user' | 'ai' | 'system';

export interface Source {
    uri: string;
    title: string;
}

export interface ChatMessage {
    id: string;
    sender: MessageSender;
    text: string;
    file?: File | null;
    sources?: Source[];
}

export type ChatMode = 'search' | 'research' | 'deepthink' | 'coding';
