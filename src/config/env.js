export const config = {
    isProduction: import.meta.env.PROD,
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5173',
};

// Optional: Create a logger utility
export const logger = {
    log: (...args) => {
        if (!config.isProduction) {
            console.log(...args);
        }
    },
    error: (...args) => {
        if (!config.isProduction) {
            console.error(...args);
        }
    },
    warn: (...args) => {
        if (!config.isProduction) {
            console.warn(...args);
        }
    },
    info: (...args) => {
        if (!config.isProduction) {
            console.info(...args);
        }
    }
};