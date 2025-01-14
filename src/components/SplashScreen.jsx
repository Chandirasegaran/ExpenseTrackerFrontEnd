import logo from '../assets/logo.webp';
import React, { useState, useEffect } from 'react';
import { ProgressBar, Field, makeStyles } from '@fluentui/react-components';
import { Navigate } from 'react-router-dom';
import { config, logger } from '../config/env';

const useStyles = makeStyles({
    splashScreen: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f3f2f1',
        padding: '10px',
        '@media (max-width: 768px)': {
            padding: '5px',
        },
    },
    logo: {
        borderRadius: '15px',
        width: '125px',
        height: 'auto',
        marginBottom: '20px',
        '@media (max-width: 768px)': {
            width: '100px',
            marginBottom: '15px',
        },
    },
    messageWrapper: {
        width: '100%',
        maxWidth: '300px',
        textAlign: 'center',
    },
    customField: {
        '& .fui-Field__validationMessage': {
            marginTop: '15px',
            fontSize: '1.25rem',
            fontWeight: '500',
            textAlign: 'center',
            '@media (max-width: 768px)': {
                fontSize: '1rem',
            },
        },
    },
    progressBar: {
        margin: '0 auto', // Center the progress bar horizontally

        '@media (max-width: 768px)': {
            width: '60%',
            maxWidth: '250px',
        }
    },
});

const SplashScreen = () => {
    const styles = useStyles();
    const [isServerUp, setIsServerUp] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    const checkServerStatus = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/expense/`);
            if (response.status === 200) {
                setIsServerUp(true);
            }
        } catch (error) {
            logger.error('Error checking server status:', error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setShowSplash(false);
            checkServerStatus();
        }, 1000);

        const interval = setInterval(checkServerStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    if (isServerUp || !showSplash) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className={styles.splashScreen}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div className={styles.messageWrapper}>
                <Field
                    validationMessage="Server is Spinning Up..."
                    validationState="none"
                    className={styles.customField}
                >
                    <ProgressBar className={styles.progressBar} />
                </Field>
            </div>
        </div>
    );
};

export default SplashScreen;
