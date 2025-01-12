import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import {
    Button,
    Text,
    Tab,
    TabList,
    tokens,
    makeStyles,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
} from "@fluentui/react-components";
import { List24Regular } from "@fluentui/react-icons";

// Define styles using makeStyles
const useStyles = makeStyles({
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: tokens.colorNeutralBackground2,
        boxShadow: tokens.shadow4,
        position: 'relative',
    },
    title: {
        fontWeight: tokens.fontWeightBold,
        fontSize: tokens.fontSizeBase600,
    },
    navButtons: {
        display: 'flex',
        gap: '10px',
        '@media (max-width: 768px)': {
            display: 'none',
        },
    },
    mobileMenuButton: {
        '@media (min-width: 768px)': {
            display: 'none',
        },
    },
    mobileMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow8,
        padding: '10px',
    },
    menuContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
});

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { userLoggedIn, currentUser } = useAuth();
    const styles = useStyles();

    const handleSignOut = async () => {
        await doSignOut();
        navigate('/login');
    };

    const navigationTabs = [
        { name: 'Daily View', href: '#daily' },
        { name: 'Weekly View', href: '#weekly' },
        { name: 'Monthly View', href: '#monthly' },
    ];

    return (
        <div className={styles.navbar}>
            <Text className={styles.title}>Expenses Tracker</Text>

            {/* Desktop Navigation */}
            <TabList className={styles.navButtons}>
                {navigationTabs.map((tab) => (
                    <Tab key={tab.name} value={tab.href}>
                        {tab.name}
                    </Tab>
                ))}
            </TabList>

            {/* Mobile Menu */}
            <Menu open={isMenuOpen} onOpenChange={(e, data) => setIsMenuOpen(data.open)}>
                
                <MenuTrigger disableButtonEnhancement>
                    <Button
                        icon={<List24Regular />}
                        className={styles.mobileMenuButton}
                        appearance="transparent"
                    />
                </MenuTrigger>
                <MenuPopover>
                    <MenuList className={styles.menuContent}>
                        {navigationTabs.map((tab) => (
                            <MenuItem key={tab.name} onClick={() => window.location.href = tab.href}>
                                {tab.name}
                            </MenuItem>
                        ))}
                        {userLoggedIn ? (
                            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                        ) : (
                            <>
                                <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
                                <MenuItem onClick={() => navigate('/register')}>
                                    Register New Account
                                </MenuItem>
                            </>
                        )}
                    </MenuList>
                </MenuPopover>
            </Menu>

            {/* Desktop Authentication Buttons */}
            <div className={styles.navButtons}>
                {userLoggedIn ? (
                    < ><Text>{currentUser.displayName ? currentUser.displayName : currentUser.email}
                    </Text>
                        <Button appearance="secondary" onClick={handleSignOut}>
                            Logout
                        </Button></>
                ) : (
                    <>
                        <Button appearance="primary" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button appearance="secondary" onClick={() => navigate('/register')}>
                            Register New Account
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;



