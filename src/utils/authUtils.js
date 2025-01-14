import { config, logger } from '../config/env';

export const syncUserWithBackend = async (user) => {
    if (!user) return;

    try {
        const userData = {
            name: user.displayName || '',
            email: user.email.toLowerCase(),
            authProvider: user.providerData[0]?.providerId || 'password'
        };

        const response = await fetch(`${config.apiUrl}/api/user/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Failed to sync user with backend');
        }

        return await response.json();
    } catch (error) {
        logger.error('Error syncing user with backend:', error);
        throw new Error('Failed to connect to the server. Please try again later.');
    }
};