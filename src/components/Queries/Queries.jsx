import React, { useEffect, useState } from 'react';
import styles from './Queries.module.css';
import { FaQuestion } from "react-icons/fa";
import { useChatSession } from '../../context/ChatSessionContext';

const Queries = () => {
    const { subQueries } = useChatSession();
    const [visibleQueries, setVisibleQueries] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const cleanedList = (subQueries || []).filter(q =>
            typeof q === "string" && q.trim().length > 5
        );

        setVisibleQueries([]);
        setIsAnimating(cleanedList.length > 0);

        if (cleanedList.length === 0) return;

        let i = 0;
        const interval = setInterval(() => {
            if (i >= cleanedList.length) {
                clearInterval(interval);
                setIsAnimating(false);
                return;
            }
            const nextItem = cleanedList[i];
            setVisibleQueries(prev => [...prev, nextItem]);
            i++;
        }, 500);

        return () => clearInterval(interval);
    }, [subQueries]);

    if (visibleQueries.length === 0 && !isAnimating) {
        return (
            <div className={styles.emptyContainer}>
                <h3 className={styles.emptyTitle}>🎓 I'm Skemeleon, your academic buddy!</h3>
                <p className={styles.emptyText}>
                    Curious about one of the topics below?<br />
                    Just ask — I’ll break it down step by step.                </p>
                <img
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmhpZDVwcGtlMzA4cmF6MXkwbHBsMGVzZjBtYXh6cm9qaGhta2E0MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/q8l9XHBoS3pJ7WCHuR/giphy.gif"
                    alt="Skemeleon graduation"
                    className={styles.gif}
                />

            </div>
        );
    }

    return (
        <div className={styles.querycontainer}>
            <h3 className={styles.title}>Key questions to help answer yours:</h3>
            <div className={styles.queryList}>
                {visibleQueries.map((q, i) => {
                    if (typeof q !== 'string' || q.trim() === '') return null;

                    return (
                        <div
                            key={i}
                            className={`${styles.queryItem} ${styles.animated}`}
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <FaQuestion className={styles.icon} />
                            <span>{q}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Queries;
