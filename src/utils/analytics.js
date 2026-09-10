const ANALYTICS_SESSION_KEY = "analytics_session_id";

export const getAnalyticsSessionId = () => {
    let sessionId = sessionStorage.getItem(
        ANALYTICS_SESSION_KEY
    );

    if (!sessionId) {
        sessionId = crypto.randomUUID();

        sessionStorage.setItem(
            ANALYTICS_SESSION_KEY,
            sessionId
        );
    }

    return sessionId;
};