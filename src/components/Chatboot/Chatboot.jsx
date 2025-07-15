import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatboot.module.css';
import { FaPaperPlane } from 'react-icons/fa';
import { MdSource } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import aiAvatar from '../../assets/images/avatar.png';
import userAvatar from '../../assets/images/avatar2.png';
import { askQuestionToAI } from "../../services/api";
import ReactMarkdown from 'react-markdown';
import { useChatSession } from '../../context/ChatSessionContext';

const Chatboot = () => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const { addSubQueries } = useChatSession();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const {
        messages,
        setMessages,
        streamedContent,
        setStreamedContent,
        visibleCitations,
        setVisibleCitations,
    } = useChatSession();

    useEffect(() => {
        if (!isLoading) return;

        const fullText = 'Searching for accurate information...';
        let i = 0;
        let direction = 'forward';

        const interval = setInterval(() => {
            setLoadingText(prev => {
                if (direction === 'forward') {
                    i++;
                    if (i >= fullText.length) {
                        direction = 'backward';
                        return fullText;
                    }
                    return fullText.slice(0, i);
                } else {
                    i--;
                    if (i <= 0) {
                        direction = 'forward';
                        return '';
                    }
                    return fullText.slice(0, i);
                }
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isLoading]);
    useEffect(() => {
        const index = messages.length - 1;
        const lastMsg = messages[index];
        if (!lastMsg || lastMsg.role !== 'assistant') return;

        const fullText = lastMsg.content;
        if (!fullText || typeof fullText !== 'string') return;

        let i = 0;

        setStreamedContent(prev => ({
            ...prev,
            [index]: fullText[0] || ''
        }));

        i = 1;

        const interval = setInterval(() => {
            if (i >= fullText.length) {
                clearInterval(interval);
                return;
            }

            const nextChar = fullText[i];
            if (typeof nextChar !== 'string') return;

            setStreamedContent(prev => {
                const current = prev[index] || '';
                const next = current + nextChar;
                return { ...prev, [index]: next };
            });

            i++;
        }, 10);
        return () => clearInterval(interval);
    }, [messages]);


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const handleCopy = (index, text) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    const toggleCitations = (index) => {
        setVisibleCitations(prev => {
            const newSet = new Set(prev);
            newSet.has(index) ? newSet.delete(index) : newSet.add(index);
            return newSet;
        });
    };

    const sendMessage = async () => {
        setIsLoading(true);
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage = { role: 'user', content: trimmed };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const result = await askQuestionToAI(
                trimmed,
                [...messages, userMessage],
                "en",
                ["Economy", "Marketing", "Accounting", "Statistics", "Geopolitics"]
            );
            console.log(result)
            const aiMessage = {
                role: 'assistant',
                content: result.response,
                citations: result.citations || []
            };
            if (Array.isArray(result.subQueries)) {
                addSubQueries(result.subQueries);
            }
            setIsLoading(false);
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setIsLoading(false); 
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '⚠️ AI error, try again.', citations: [] }
            ]);
        }
    };
    // useEffect(() => {
    //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages, streamedContent]);

    return (
        <div className={styles.container}>
            <div className={styles.chatArea}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.role === 'user' ? styles.userMessage : styles.aiMessage
                        }
                    >
                        {msg.role === 'user' ? (
                            <div className={styles.userBubble}>
                                <div className={styles.userAvatarWrapper}>
                                    <img src={userAvatar} alt="User" className={styles.userAvatar} />
                                </div>
                                <div className={styles.userContent}>
                                    <span>{msg.content}</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.aiBubble}>
                                <div className={styles.aiAvatarWrapper}>
                                    <img src={aiAvatar} alt="AI" className={styles.aiAvatar} />
                                </div>
                                <div className={styles.aiContent}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => <p className={styles.markdownContent}>{children}</p>,
                                            h3: ({ children }) => <div className={styles.heading}>{children}</div>,
                                            h4: ({ children }) => <div className={styles.subheading}>{children}</div>,
                                            ul: ({ children }) => <ul className={styles.inlineList}>{children}</ul>,
                                            li: ({ children }) => <li className={styles.inlineListItem}>{children}</li>,
                                            strong: ({ children }) => <strong className={styles.markdownContent}>{children}</strong>
                                        }}
                                    >
                                        {streamedContent[index] || msg.content}
                                    </ReactMarkdown>
                                    <div className={styles.aiActions}>
                                        {msg.citations?.length > 0 && (
                                            <button className={styles.iconButton} onClick={() => toggleCitations(index)}>
                                                <MdSource />
                                            </button>
                                        )}
                                        <div style={{ position: 'relative' }}>
                                            {copiedIndex === index && (
                                                <div className={styles.tooltip}>Copied!</div>
                                            )}
                                            <button
                                                className={styles.iconButton}
                                                onClick={() => handleCopy(index, msg.content)}
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>

                                    </div>
                                    {visibleCitations.has(index) && msg.citations?.length > 0 && (
                                        <div className={styles.citationBox}>
                                            <strong>Sources :</strong>
                                            <ul className={styles.citationList}>
                                                {msg.citations.map((c, i) => (
                                                    <li key={i}>
                                                        <a href={c} target="_blank" rel="noopener noreferrer">{c}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className={`${styles.aiMessage} ${styles.loadingMessage}`}>
                        <div className={styles.searchingContent}>
                            <img
                                src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjlnZTVjNHZiM282Y2owZXptYXZoeWp4Zm5qZDloeDAwN2dicmw1MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/tsYCcXey7FNqsxMgk3/giphy.gif"
                                alt="loading"
                            />
                            <p className={styles.streamingText}><strong>{loadingText}</strong></p>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className={styles.inputArea}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask or search..."
                    className={styles.textarea}
                    rows={4}
                />
                <button onClick={sendMessage} className={styles.sendButton}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default Chatboot;
