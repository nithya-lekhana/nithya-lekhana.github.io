/**
 * Utility for caching GitHub API responses in localStorage.
 * Helps prevent hitting API rate limits and improves page load speed.
 */

const CACHE_PREFIX = 'portfolio_github_';
// 12 hours in milliseconds
const CACHE_TTL = 12 * 60 * 60 * 1000; 

export const getFromCache = (key) => {
    const cachedDataStr = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cachedDataStr) return null;

    try {
        const cachedData = JSON.parse(cachedDataStr);
        const now = new Date().getTime();
        
        if (now - cachedData.timestamp > CACHE_TTL) {
            localStorage.removeItem(`${CACHE_PREFIX}${key}`);
            return null; // Cache expired
        }
        
        return cachedData.data;
    } catch (e) {
        console.warn('Failed to parse cached data for', key);
        return null;
    }
};

export const saveToCache = (key, data) => {
    try {
        const cacheObj = {
            timestamp: new Date().getTime(),
            data: data
        };
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheObj));
    } catch (e) {
        console.warn('Failed to save to cache. LocalStorage might be full.', e);
    }
};

export const clearCache = () => {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
};
