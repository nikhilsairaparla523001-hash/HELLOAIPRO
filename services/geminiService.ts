import { GenerateContentResponse, Chat } from "@google/genai";
import { Source } from "../types";

const fileToGenerativePart = async (
    file: File,
    onProgress: (percent: number) => void
) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };
        reader.onloadend = () => {
            onProgress(100);
            resolve((reader.result as string).split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const generateResponse = async (
    prompt: string,
    file: File | null,
    chat: Chat,
    onUpdate: (update: { text?: string; sources?: Source[]; isFinal?: boolean }) => void,
    onUploadProgress: (percent: number) => void
) => {
    // Text & Vision models (Streaming)
    const parts = [];
    if (file) {
        parts.push(await fileToGenerativePart(file, onUploadProgress));
    }
    if (prompt) {
        parts.push({ text: prompt });
    }
    
    const stream = await chat.sendMessageStream({ message: parts });
    
    const collectedSources: { [uri: string]: Source } = {};

    for await (const chunk of stream) {
       const c = chunk as GenerateContentResponse;
       const text = c.text;

       const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
       let newSourcesFound = false;
       if (groundingChunks) {
            for (const chunk of groundingChunks) {
                if (chunk.web && chunk.web.uri && !collectedSources[chunk.web.uri]) {
                    const newSource = { uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri };
                    collectedSources[newSource.uri] = newSource;
                    newSourcesFound = true;
                }
            }
       }

       onUpdate({
           text: text,
           sources: newSourcesFound ? Object.values(collectedSources) : undefined,
       });
    }
     onUpdate({ isFinal: true }); // Signal completion
};