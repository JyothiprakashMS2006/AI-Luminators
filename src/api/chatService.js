
const API_URL = 'http://localhost:3000/api/chat';

export const streamChatResponse = async (mode, messages, files = [], onChunk, onComplete, onError) => {
    try {
        const formData = new FormData();
        formData.append('mode', mode);
        // Send messages as JSON string
        formData.append('messages', JSON.stringify(messages));

        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: DONE } = await reader.read();
            done = DONE;
            const chunkValue = decoder.decode(value, { stream: true });
            if (chunkValue) {
                onChunk(chunkValue);
            }
        }

        if (onComplete) onComplete();

    } catch (error) {
        console.error("Chat Stream Error:", error);
        if (onError) onError(error);
    }
};
