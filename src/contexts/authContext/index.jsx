import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { syncUserWithBackend } from "../../utils/authUtils"; // Add this import
import { logger } from "../../config/env"; // Add this import

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, []);

    async function initializeUser(user) {
        if (user) {
            setCurrentUser(user);
            setUserLoggedIn(true);
            try {
                await syncUserWithBackend(user);
            } catch (error) {
                logger.error('Error syncing user:', error);
                // Consider how you want to handle sync failures
            }

        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }
    const value = {
        currentUser,
        userLoggedIn,
        loading
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}