import { streamAskQuestionToAI } from "../services/api";

const SESSION_KEY = "chat_history";

export const askQuestionToAI = async (question, onToken) => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    const history = stored ? JSON.parse(stored) : [];

    const { userMessage, aiMessage } = await streamAskQuestionToAI(question, history, null, onToken);

    const updatedHistory = [...history, userMessage, aiMessage];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedHistory));

    return aiMessage.content;
};

export const getChatHistory = () => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const clearChatHistory = () => {
    sessionStorage.removeItem(SESSION_KEY);
};
