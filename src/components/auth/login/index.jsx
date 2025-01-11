import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import {
    TextField,
    PrimaryButton,
    DefaultButton,
    Stack,
    Text,
    MessageBar,
    MessageBarType,
    Spinner,
} from '@fluentui/react';

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (err) {
                setErrorMessage(err.message);
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithGoogle();
            } catch (err) {
                setErrorMessage(err.message);
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div>
            {userLoggedIn && <Navigate to="/home" replace={true} />}

            <Stack
                horizontalAlign="center"
                verticalAlign="center"
                verticalFill
                styles={{
                    root: { width: '100%', height: '100vh' },
                }}
            >
                <Stack
                    tokens={{ childrenGap: 15 }}
                    styles={{
                        root: {
                            width: '90%',
                            maxWidth: 400,
                            padding: 20,
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                            borderRadius: 10,
                        },
                    }}
                >
                    <Text variant="xLarge" block>
                        Welcome Back
                    </Text>

                    <form onSubmit={onSubmit}>
                        <Stack tokens={{ childrenGap: 10 }}>
                            <TextField
                                label="Email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e, newValue) => setEmail(newValue)}
                                disabled={isSigningIn}
                            />
                            
                            <TextField
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e, newValue) => setPassword(newValue)}
                                disabled={isSigningIn}
                            />
                            {errorMessage && (
                                <MessageBar messageBarType={MessageBarType.error}>
                                    {errorMessage}
                                </MessageBar>
                            )}
                            <PrimaryButton
                                type="submit"
                                text={isSigningIn ? (
                                    <Spinner label="Signing In..." ariaLive="assertive" labelPosition="right" />

                                    
                                    // 'Signing In...'
                                ) : 'Sign In'}
                                disabled={isSigningIn}
                                styles={{ root: { width: '100%' } }}
                            />
                        </Stack>
                    </form>
                    <Text variant="small" block>
                        Don't have an account?{' '}
                        <Link to="/register">Sign up</Link>
                    </Text>
                    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 5 }}>
                        <div
                            style={{
                                borderBottom: '1px solid #ccc',
                                flexGrow: 1,
                            }}
                        />
                        <Text variant="small">OR</Text>
                        <div
                            style={{
                                borderBottom: '1px solid #ccc',
                                flexGrow: 1,
                            }}
                        />
                    </Stack>
                    <DefaultButton
                        onClick={onGoogleSignIn}
                        disabled={isSigningIn}
                        styles={{ root: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } }}
                    >
                        {isSigningIn ? (
                                          <Spinner label=" " ariaLive="assertive" labelPosition="right" />

                        ) : (
                            <svg
                                className="google-logo"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    width: '20px', // Adjusted width
                                    height: '20px', // Adjusted height
                                    marginRight: '10px',
                                }}
                            >
                                <g clipPath="url(#clip0_17_40)">
                                    <path
                                        d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                                        fill="#FBBC04"
                                    />
                                    <path
                                        d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                                        fill="#EA4335"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_17_40">
                                        <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        )}
                        Continue with Google
                    </DefaultButton>

                </Stack>
            </Stack>
        </div>
    );
};

export default Login;
