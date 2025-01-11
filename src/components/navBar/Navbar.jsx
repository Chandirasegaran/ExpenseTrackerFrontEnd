import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import {
    CommandBarButton,
    DefaultButton,
    PrimaryButton,
    Stack,
    Text,
    IconButton,
} from '@fluentui/react';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            styles={{
                root: {
                    padding: '10px 20px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f3f3f3',
                    position: 'relative',
                },
            }}
        >
            <Text variant="xLarge" styles={{ root: { fontWeight: 'bold' } }}>
                Expenses Tracker
            </Text>
{/* 
            <Stack
                horizontal
                tokens={{ childrenGap: 10 }}
                styles={{
                    root: {
                        display: isMenuOpen ? 'none' : 'flex',
                    },
                }}
            >
                <CommandBarButton text="Daily View" href="#daily" />
                <CommandBarButton text="Weekly View" href="#weekly" />
                <CommandBarButton text="Monthly View" href="#monthly" />
            </Stack> */}


            {/* Mobile Menu Button */}
            <IconButton
                iconProps={{ iconName: 'GlobalNavButton' }}
                title="Menu"
                ariaLabel="Menu"
                onClick={toggleMenu}
                styles={{
                    root: {
                        display: isMenuOpen ? 'none' : 'block',
                        '@media (min-width: 768px)': {
                            display: 'none',
                        },
                    },
                }}
            />

            {/* Mobile Menu */}
            {isMenuOpen && (
                <Stack
                    tokens={{ childrenGap: 10 }}
                    styles={{
                        root: {
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            padding: 10,
                        },
                    }}
                >
                    <CommandBarButton text="Daily View" href="#daily" />
                    <CommandBarButton text="Weekly View" href="#weekly" />
                   
                   <CommandBarButton text="Monthly View" href="#monthly" />
                    {userLoggedIn ? (
                        <DefaultButton
                            text="Logout"
                            onClick={() =>
                                doSignOut().then(() => {
                                    navigate('/login');
                                })
                            }
                        />
                    ) : (
                        <>
                            <PrimaryButton
                                text="Login"
                                onClick={() => navigate('/login')}
                            />
                            <DefaultButton
                                text="Register New Account"
                                onClick={() => navigate('/register')}
                            />
                        </>
                    )}
                </Stack>
            )}

            {/* User Action Buttons */}
            <Stack
                horizontal
                tokens={{ childrenGap: 10 }}
                styles={{
                    root: {
                        '@media (max-width: 768px)': {
                            display: 'none',
                        },
                    },
                }}
            >
                {userLoggedIn ? (
                    <DefaultButton
                        text="Logout"
                        onClick={() =>
                            doSignOut().then(() => {
                                navigate('/login');
                            })
                        }
                    />
                ) : (
                    <>
                        <PrimaryButton
                            text="Login"
                            onClick={() => navigate('/login')}
                        />
                        <DefaultButton
                            text="Register New Account"
                            onClick={() => navigate('/register')}
                        />
                    </>
                )}
            </Stack>
        </Stack>
    );
};

export default Navbar;


// // Navbar.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../contexts/authContext'
// import { doSignOut } from '../../firebase/auth'
// import './Navbar.css';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate = useNavigate()
//     const { userLoggedIn } = useAuth()
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="bodyc">
//       <nav className="navbar">
//         <div className="navbar-header">Expenses Tracker</div>
//         <button className="hamburger" onClick={toggleMenu}>
//           <span className="hamburger-line"></span>
//           <span className="hamburger-line"></span>
//           <span className="hamburger-line"></span>
//         </button>
        
//         <div className={`navbar-container ${isMenuOpen ? 'open' : ''}`}>
//           <a href="#daily" className="nav-link">Daily View</a>
//           <a href="#weekly" className="nav-link">Weekly View</a>
//           <a href="#monthly" className="nav-link">Monthly View</a>
//         </div>
//         <div className={`navbar-container ${isMenuOpen ? 'open' : ''}`}>
//           {
//             userLoggedIn
//               ?
//               <>
//                 <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>
//               </>
//               :
//               <>
//                 <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
//                 <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
//               </>
//           }
//           </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;
