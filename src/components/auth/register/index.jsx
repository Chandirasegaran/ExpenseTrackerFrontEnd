import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import { TextField, PrimaryButton, Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';


const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            try {
                await doCreateUserWithEmailAndPassword(email, password);
                navigate('/home');
            } catch (error) {
                setErrorMessage(error.message);
                setIsRegistering(false);
            }
        }
    };

    return (
        <>
            {userLoggedIn && <Navigate to={'/home'} replace={true} />}

            <Stack horizontalAlign="center" verticalAlign="center" verticalFill styles={{ root: { width: '100%', height: '100vh' } }}>
                <Stack tokens={{ childrenGap: 15 }} styles={{ root: { width: '90%', maxWidth: 400, padding: 20, boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: 10 } }}>
                    <Text variant="xLarge" block>
                        Create a New Account
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
                            />
                            <TextField
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e, newValue) => setPassword(newValue)}
                                disabled={isRegistering}
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                autoComplete="off"
                                required
                                value={confirmPassword}
                                onChange={(e, newValue) => setConfirmPassword(newValue)}
                                disabled={isRegistering}
                            />
                            {errorMessage && (
                                <MessageBar messageBarType={MessageBarType.error}>
                                    {errorMessage}
                                </MessageBar>
                            )}
                            <PrimaryButton
                                type="submit"
                                text={isRegistering ? (
                                    <Spinner label="Signing Up" ariaLive="assertive" labelPosition="right" />

                                    // 'Signing Up...'
                                ) : 'Sign Up'}
                                disabled={isRegistering}
                                styles={{ root: { width: '100%' } }}
                            />
                            <Text variant="small" block>
                                Already have an account?{' '}
                                <Link to={'/login'}>Continue</Link>
                            </Text>

                        </Stack>
                    </form>
                </Stack>
            </Stack>
        </>
    );
};

export default Register;
