import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import {
    Button,
    Text,
    makeStyles,
    OverlayDrawer,
    DrawerHeader,
    DrawerHeaderTitle,
    DrawerBody,
    Avatar,
    Divider,
} from "@fluentui/react-components";
import {
    List24Regular,
    Dismiss24Regular,
    Person24Regular,
    Settings24Regular,
    QuestionCircle24Regular,
    SignOut24Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        '@media (max-width: 768px)': {
            padding: '10px',
        },
    },
    title: {
        fontWeight: '600',
        fontSize: '1.5rem',
        color: '#242424',
        '@media (max-width: 768px)': {
            fontSize: '1.2rem',
        },
    },
    navButtons: {
        display: 'flex',
        gap: '10px',
        '@media (max-width: 768px)': {
            display: 'none',
        },
    },
    mobileMenuButton: {
        '@media (min-width: 769px)': {
            display: 'none',
        },
    },
    drawer: {
        width: '320px',
        '@media (max-width: 768px)': {
            width: '100%',
        },
    },
    profileSection: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        // backgroundColor: '#f8f8f8',
        borderRadius: '8px',
        margin: '0 16px 16px',
    },
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
    },
    avatar: {
        width: '32px',
        height: '32px',
        backgroundColor: '#0078D4',
        fontSize: '2rem',
        color: '#fff',
    },
    userName: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#242424',
    },
    userEmail: {
        fontSize: '0.875rem',
        color: '#616161',
    },
    menuSection: {
        padding: '0 16px',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        width: '100%',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#f3f2f1',
        },
    },
    menuItemText: {
        fontSize: '0.938rem',
        color: '#242424',
    },
    menuIcon: {
        color: '#616161',
    },
    divider: {
        margin: '16px 0',
    },
    desktopAvatarWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        padding: '6px 12px',
        borderRadius: '4px',
        '&:hover': {
            backgroundColor: '#f3f2f1',
        },
    },
});

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const { userLoggedIn, currentUser } = useAuth();
    const styles = useStyles();

    const handleSignOut = async () => {
        await doSignOut();
        setIsDrawerOpen(false);
        navigate('/login');
    };

    const getFirstLetter = (name) => name && name.charAt(0).toUpperCase();

    const MenuItem = ({ icon, text, onClick }) => (
        <button className={styles.menuItem} onClick={onClick}>
            {icon}
            <Text className={styles.menuItemText}>{text}</Text>
        </button>
    );

    return (
        <div className={styles.navbar}>
            <Text className={styles.title}>Expenses Tracker</Text>

            <Button
                icon={<List24Regular />}
                className={styles.mobileMenuButton}
                appearance="transparent"
                onClick={() => setIsDrawerOpen(true)}
            />

            <OverlayDrawer
                position="end"
                open={isDrawerOpen}
                onOpenChange={(_, { open }) => setIsDrawerOpen(open)}
                className={styles.drawer}
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close"
                                icon={<Dismiss24Regular />}
                                onClick={() => setIsDrawerOpen(false)}
                            />
                        }
                    >
                        Account
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody>
                    {userLoggedIn ? (
                        <>
                            <div className={styles.profileSection}>
                                <Avatar className={styles.avatar}>
                                    {getFirstLetter(currentUser.displayName)}
                                </Avatar>
                                <div className={styles.profileInfo}>
                                    <Text className={styles.userName}>
                                        {currentUser.displayName}
                                    </Text>
                                    <Text className={styles.userEmail}>
                                        {currentUser.email}
                                    </Text>
                                </div>
                            </div>
                            <div className={styles.menuSection}>
                                {/* <MenuItem 
                                    icon={<Person24Regular className={styles.menuIcon} />}
                                    text="My Profile"
                                    onClick={() => {}}
                                />
                                <MenuItem 
                                    icon={<Settings24Regular className={styles.menuIcon} />}
                                    text="Settings"
                                    onClick={() => {}}
                                /> */}
                                <MenuItem 
                                    icon={<QuestionCircle24Regular className={styles.menuIcon} />}
                                    text="Help & Support"
                                    onClick={() => {'mailto:chandirasegaransegar@gmail.com'}}
                                />
                                <Divider className={styles.divider} />
                                <MenuItem 
                                    icon={<SignOut24Regular className={styles.menuIcon} />}
                                    text="Sign Out"
                                    onClick={handleSignOut}
                                />
                            </div>
                        </>
                    ) : (
                        <div className={styles.menuSection}>
                            <Button 
                                appearance="primary" 
                                onClick={() => navigate('/login')}
                                className="w-full mb-4"
                            >
                                Login
                            </Button>
                            <Button 
                                appearance="secondary" 
                                onClick={() => navigate('/register')}
                                className="w-full"
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                </DrawerBody>
            </OverlayDrawer>

            <div className={styles.navButtons}>
                {userLoggedIn ? (
                    <div 
                        className={styles.desktopAvatarWrapper}
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <Avatar className={styles.avatar}>
                            {getFirstLetter(currentUser.displayName)}
                        </Avatar>
                        <Text>{currentUser.displayName}</Text>
                    </div>
                ) : (
                    <>
                        <Button appearance="primary" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button appearance="secondary" onClick={() => navigate('/register')}>
                            
                            Sign Up
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/authContext';
// import { doSignOut } from '../../firebase/auth';
// import {
//     Button,
//     Text,
//     makeStyles,
//     OverlayDrawer,
//     DrawerHeader,
//     DrawerHeaderTitle,
//     DrawerBody,
//     Avatar,
// } from "@fluentui/react-components";
// import { List24Regular, Dismiss24Regular } from "@fluentui/react-icons";

// const useStyles = makeStyles({
//     navbar: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: '10px 20px',
//         backgroundColor: '#f3f2f1',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         position: 'relative',
//         '@media (max-width: 768px)': {
//             padding: '10px',
//         },
//     },
//     title: {
//         fontWeight: 'bold',
//         fontSize: '1.5rem',
//         '@media (max-width: 768px)': {
//             fontSize: '1.2rem',
//         },
//     },
//     navButtons: {
//         display: 'flex',
//         gap: '10px',
//         '@media (max-width: 768px)': {
//             display: 'none',
//         },
//     },
//     mobileMenuButton: {
//         '@media (min-width: 769px)': {
//             display: 'none',
//         },
//     },
//     profileInfo: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '10px',
//         textAlign: 'center',
//     },
//     avatar: {
//         backgroundColor: '#0078D4',
//         fontSize: '1.25rem',
//         color: '#fff',
//         cursor: 'pointer', // Cursor pointer for avatar click
//     },
//     menuItem: {
//         padding: '10px 20px',
//     },
//     desktopAvatarWrapper: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '10px',
//     },
// });

// const Navbar = () => {
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);  // State for mobile drawer
//     const navigate = useNavigate();
//     const { userLoggedIn, currentUser } = useAuth();
//     const styles = useStyles();

//     const handleSignOut = async () => {
//         await doSignOut();
//         navigate('/login');
//     };

//     // Get the first letter of the user's first name
//     const getFirstLetter = (name) => name && name.charAt(0).toUpperCase();

//     // Handle avatar click to open the drawer
//     const handleAvatarClick = () => {
//         setIsDrawerOpen(true);
//     };

//     return (
//         <div className={styles.navbar}>
//             <Text className={styles.title}>Expenses Tracker</Text>

//             {/* Mobile Menu (Drawer) */}
//             <Button
//                 icon={<List24Regular />}
//                 className={styles.mobileMenuButton}
//                 appearance="transparent"
//                 onClick={() => setIsDrawerOpen(true)}  // Open the drawer on button click
//             />

//             <OverlayDrawer
//                 position="end" // Set position to 'end' to open from the right side
//                 open={isDrawerOpen}
//                 onOpenChange={(_, { open }) => setIsDrawerOpen(open)} // Handle open/close
//             >
//                 <DrawerHeader>
//                     <DrawerHeaderTitle
//                         action={
//                             <Button
//                                 appearance="subtle"
//                                 aria-label="Close"
//                                 icon={<Dismiss24Regular />}
//                                 onClick={() => setIsDrawerOpen(false)}  // Close drawer on button click
//                             />
//                         }
//                     >
//                         User Info
//                     </DrawerHeaderTitle>
//                 </DrawerHeader>
//                 <DrawerBody>
//                     {userLoggedIn ? (
//                         <div className={styles.profileInfo}>
//                             {/* Profile Picture as First Letter */}
//                             <Avatar className={styles.avatar} onClick={handleAvatarClick}>{getFirstLetter(currentUser.displayName)}</Avatar>
//                             <Text>{currentUser.displayName}</Text>
//                             <Text>{currentUser.email}</Text>
//                             <Button appearance="secondary" onClick={handleSignOut}>Logout</Button>
//                         </div>
//                     ) : (
//                         <div className={styles.profileInfo}>
//                             <Button appearance="primary" onClick={() => navigate('/login')}>Login</Button>
//                             <Button appearance="secondary" onClick={() => navigate('/register')}>Register New Account</Button>
//                         </div>
//                     )}
//                 </DrawerBody>
//             </OverlayDrawer>

//             {/* Desktop Authentication Buttons */}
//             <div className={styles.navButtons}>
//                 {userLoggedIn ? (
//                     <div className={styles.desktopAvatarWrapper}>
//                         {/* Profile info for desktop */}
//                         <Avatar className={styles.avatar} onClick={handleAvatarClick}>{getFirstLetter(currentUser.displayName)}</Avatar>
//                         <Text>{currentUser.displayName}</Text>
//                     </div>
//                 ) : (
//                     <>
//                         <Button appearance="primary" onClick={() => navigate('/login')}>
//                             Login
//                         </Button>
//                         <Button appearance="secondary" onClick={() => navigate('/register')}>
//                             Register New Account
//                         </Button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Navbar;
