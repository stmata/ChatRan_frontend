const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:9001";

export const askQuestionToAI = async (question, history = [], language = "en", allowed_topics = []) => {
    const payload = {
        question,
        language,
        allowed_topics,
        conversation_history: history.map(msg => ({
            role: msg.role,
            content: msg.content
        }))
    };

    try {
        const res = await fetch(`${BASE_URL}/chat/stream`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const json = await res.json();
        return {
            subQueries: json.sub_queries,
            response: json.response,
            citations: json.citations,
            outOfScope: json.out_of_scope,
            allowedTopics: json.allowed_topics,
        };
    } catch (err) {
        console.error(" API Error:", err);
        throw err;
    }
};
