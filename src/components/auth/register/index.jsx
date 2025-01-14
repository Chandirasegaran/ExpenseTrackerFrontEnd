import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import { updateProfile } from 'firebase/auth'; // Add this import

import {
    makeStyles,
    Text,
    Button,
    Input,
    Spinner,
    Field,
    MessageBar,
    MessageBarBody,
    tokens,
} from '@fluentui/react-components';
import Navbar from '../../navBar/Navbar';

import { PersonRegular, Mail20Regular, Password20Regular } from "@fluentui/react-icons";
import { config, logger } from '../../../config/env';


const useStyles = makeStyles({
    container: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@media (max-width: 768px)': {
            marginTop: '-18%',
        }
    },
    formContainer: {
        width: '90%',
        maxWidth: '400px',
        padding: '24px',
        boxShadow: tokens.shadow8,
        borderRadius: tokens.borderRadiusMedium,
        backgroundColor: tokens.colorNeutralBackground1,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '16px',
    },
    link: {
        color: tokens.colorBrandForeground1,
        textDecoration: 'none',
        ':hover': {
            textDecoration: 'underline',
        }
    }
});

const Register = () => {
    const styles = useStyles();
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return "This email is already registered. Please use a different email or sign in.";
            case 'auth/invalid-email':
                return "Invalid email format. Please enter a valid email address.";
            case 'auth/weak-password':
                return "Password is too weak. Please use at least 6 characters.";
            case 'auth/network-request-failed':
                return "Network error. Please check your internet connection and try again.";
            default:
                return error.message || "An error occurred during registration. Please try again.";
        }
    };

    const addUserToBackend = async (userData) => {
        try {
            const response = await fetch(`${config.apiUrl}/api/user/addUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Failed to register user in backend');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Failed to connect to the server. Please try again later.');
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            setErrorMessage('');

            try {
                // Validation
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (!name.trim()) {
                    throw new Error("Name is required");
                }

                // Step 1: Create Firebase user
                const userCredential = await doCreateUserWithEmailAndPassword(email, password);

                // Step 2: Update Firebase profile with name
                await updateProfile(userCredential.user, {
                    displayName: name.trim()
                });

                // Step 3: Add user to backend
                await addUserToBackend({
                    name: name.trim(),
                    email: email.toLowerCase()
                });

                // Success - navigate to home
                navigate('/home');
            } catch (error) {
                // If backend registration fails, we should handle Firebase user cleanup
                // This is a basic implementation - you might want to add more sophisticated error handling
                setErrorMessage(error.code ? getErrorMessage(error) : error.message);
            } finally {
                setIsRegistering(false);
            }
        }
    };


    if (userLoggedIn) {
        return <Navigate to="/home" replace={true} />;
    }


    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <Text size={800} weight="semibold" block as="h1">
                        Create a New Account
                    </Text>

                    <form onSubmit={onSubmit} className={styles.form}>
                        <Field label="Name" required>
                            <Input
                                type="text"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isRegistering}
                                placeholder="Enter your full name"
                                contentBefore={<PersonRegular />}
                            />
                        </Field>

                        <Field label="Email" required>
                            <Input
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isRegistering}
                                placeholder="Enter your email"
                                contentBefore={<Mail20Regular />}
                            />
                        </Field>

                        <Field label="Password" required>
                            <Input
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isRegistering}
                                placeholder="Create a password"
                                contentBefore={<Password20Regular />}
                            />
                        </Field>

                        <Field label="Confirm Password" required>
                            <Input
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isRegistering}
                                placeholder="Confirm your password"
                                contentBefore={<Password20Regular />}
                            />
                        </Field>

                        {errorMessage && (
                            <MessageBar intent="error">
                                <MessageBarBody>
                                    {errorMessage}
                                </MessageBarBody>
                            </MessageBar>
                        )}

                        <Button
                            type="submit"
                            appearance="primary"
                            disabled={isRegistering}
                        >
                            {isRegistering ? <Spinner size="tiny" /> : 'Sign Up'}
                        </Button>
                    </form>

                    <Text align="center" size={200}>
                        Already have an account?{' '}
                        <Link to="/login" className={styles.link}>
                            Sign in
                        </Link>
                    </Text>
                </div>
            </div>
        </>
    );
};

export default Register;

