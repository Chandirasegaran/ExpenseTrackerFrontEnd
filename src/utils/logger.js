// src/utils/logger.js

const isProduction = process.env.NODE_ENV === 'production';

// Create a custom logger object
export const logger = {
    log: (...args) => {
        if (!isProduction) {
            console.log(...args);
        }
    },
    error: (...args) => {
        if (!isProduction) {
            console.error(...args);
        }
    },
    warn: (...args) => {
        if (!isProduction) {
            console.warn(...args);
        }
    },
    info: (...args) => {
        if (!isProduction) {
            console.info(...args);
        }
    }
};

// Optional: Disable all console methods in production
if (isProduction) {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
}