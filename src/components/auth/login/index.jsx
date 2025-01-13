import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
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
import { PersonRegular, MailRegular, PasswordRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
    container: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@media (max-width: 768px)' :{
            marginTop: '-15%',
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
    dividerContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '16px 0',
    },
    divider: {
        flexGrow: 1,
        height: '1px',
        backgroundColor: tokens.colorNeutralStroke2,
    },
    link: {
        color: tokens.colorBrandForeground1,
        textDecoration: 'none',
        ':hover': {
            textDecoration: 'underline',
        }
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
    },
    googleIcon: {
        width: '20px',
        height: '20px',
    },
    errorMessage: {
        marginBottom: '12px',
    }
});

const Login = () => {
    const styles = useStyles();
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setErrorMessage('');
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (err) {
                setErrorMessage(getErrorMessage(err));
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setErrorMessage('');
            try {
                await doSignInWithGoogle();
            } catch (err) {
                setErrorMessage(getErrorMessage(err));
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const getErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                return "Sign in was cancelled. Please try again.";
            case 'auth/invalid-credential':
                return "Invalid email or password. Please check your credentials and try again.";
            case 'auth/user-not-found':
                return "No account found with this email. Please check your email or create a new account.";
            case 'auth/wrong-password':
                return "Incorrect password. Please try again.";
            case 'auth/invalid-email':
                return "Invalid email format. Please enter a valid email address.";
            case 'auth/too-many-requests':
                return "Too many unsuccessful login attempts. Please try again later.";
            case 'auth/network-request-failed':
                return "Network error. Please check your internet connection and try again.";
            default:
                return error.message || "An error occurred during sign in. Please try again.";
        }
    };

    if (userLoggedIn) {
        return <Navigate to="/home" replace={true} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <Text size={800} weight="semibold" block as="h1">
                    Welcome Back
                </Text>

                <form onSubmit={onSubmit} className={styles.form}>
                    <Field label="Email" required>
                        <Input
                        contentBefore={<MailRegular />}
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSigningIn}
                        />
                    </Field>

                    <Field label="Password" required>
                        <Input
                            contentBefore={<PasswordRegular />}
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSigningIn}
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
                        disabled={isSigningIn}
                    >
                        {isSigningIn ? <Spinner size="tiny" /> : 'Sign In'}
                    </Button>
                </form>

                <Text align="center" size={200}>
                    Don't have an account?{' '}
                    <Link to="/register" className={styles.link}>
                        Sign up
                    </Link>
                </Text>

                <div className={styles.dividerContainer}>
                    <div className={styles.divider} />
                    <Text size={200}>OR</Text>
                    <div className={styles.divider} />
                </div>

                <Button
                    onClick={onGoogleSignIn}
                    disabled={isSigningIn}
                    appearance="secondary"
                    className={styles.googleButton}
                >
                    {isSigningIn ? (
                        <Spinner size="tiny" />
                    ) : (
                        <svg
                            className={styles.googleIcon}
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_17_40)">
                                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_17_40">
                                    <rect width="48" height="48" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    )}
                    Continue with Google
                </Button>
            </div>
        </div>
    );
};

export default Login;

