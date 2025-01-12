import React, { useState } from 'react';
import { TextField, PrimaryButton, Pivot, PivotItem } from '@fluentui/react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { initializeApp } from 'firebase/app';
// import { firebaseConfig } from '../../firebase/firebase'; // Adjust the path as necessary

// initializeApp(firebaseConfig);
const auth = getAuth();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Logged in successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Registered successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            alert('Logged in with Google');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={{ width: '300px', margin: '0 auto', paddingTop: '50px' }}>
            <Pivot>
                <PivotItem headerText="Login">
                    <TextField label="Email" value={email} onChange={(e, newValue) => setEmail(newValue)} />
                    <TextField label="Password" type="password" value={password} onChange={(e, newValue) => setPassword(newValue)} />
                    <PrimaryButton text="Login" onClick={handleLogin} style={{ marginTop: '10px' }} />
                    <PrimaryButton text="Continue with Google" onClick={handleGoogleLogin} style={{ marginTop: '10px' }} />
                </PivotItem>
                <PivotItem headerText="Register">
                    <TextField label="Name" value={name} onChange={(e, newValue) => setName(newValue)} />
                    <TextField label="Email" value={email} onChange={(e, newValue) => setEmail(newValue)} />
                    <TextField label="Password" type="password" value={password} onChange={(e, newValue) => setPassword(newValue)} />
                    <PrimaryButton text="Register" onClick={handleRegister} style={{ marginTop: '10px' }} />
                    <PrimaryButton text="Continue with Google" onClick={handleGoogleLogin} style={{ marginTop: '10px' }} />
                </PivotItem>
            </Pivot>
        </div>
    );
};

export default Login;