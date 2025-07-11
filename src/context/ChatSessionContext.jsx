import { v4 as uuidv4 } from 'uuid';
import { createContext, useContext, useState } from "react";

const ChatSessionContext = createContext();

export const ChatSessionProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [session_id, setSessionId] = useState(uuidv4());
    const [subQueries, setSubQueries] = useState([]);
    const [streamedContent, setStreamedContent] = useState({});
    const [citations, setCitations] = useState([]);
    const [visibleCitations, setVisibleCitations] = useState(new Set());

    const addSubQueries = (newSubQueries) => {
        if (!Array.isArray(newSubQueries)) return;
        setSubQueries([...newSubQueries]);
    };

    const resetSession = () => {
        setMessages([]);
        setSubQueries([]);
        setCitations([]);
        setStreamedContent({});
        setVisibleCitations(new Set());
        setSessionId(uuidv4());
    };

    return (
        <ChatSessionContext.Provider value={{
            setMessages,
            messages,
            session_id,
            subQueries,
            setSubQueries,
            addSubQueries,
            citations,
            setCitations,
            streamedContent,
            setStreamedContent,
            visibleCitations,
            setVisibleCitations,
            resetSession
        }}>
            {children}
        </ChatSessionContext.Provider>
    );
};

export const useChatSession = () => useContext(ChatSessionContext);
