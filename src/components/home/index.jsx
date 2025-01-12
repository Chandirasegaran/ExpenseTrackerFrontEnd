// Home.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { Tab, TabList, makeStyles, Text } from "@fluentui/react-components";
import DailyView from '../../Pages/DailyView/DailyView';
import MonthlyView from '../../Pages/MonthlyView/MonthlyView';
import AllExpenses from '../../Pages/AllExpenses/AllExpenses';

const useStyles = makeStyles({
    container: {
        padding: '20px',
    },
    header: {
        marginBottom: '20px',
    },
    welcome: {
        marginBottom: '16px',
    },
    date: {
        color: 'rgb(96, 94, 92)',
    }
});

const Home = () => {
    const { currentUser } = useAuth();
    const styles = useStyles();
    const [selectedTab, setSelectedTab] = useState('daily');

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const renderView = () => {
        switch (selectedTab) {
            case 'daily':
                return <DailyView />;
            case 'monthly':
                return <MonthlyView />;
            case 'all':
                return <AllExpenses />;
            default:
                return <DailyView />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text block size={500} className={styles.welcome}>
                    Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}!
                </Text>
                <Text block size={300} className={styles.date}>
                    {currentDate}
                </Text>
            </div>

            <TabList selectedValue={selectedTab} onTabSelect={(_, data) => setSelectedTab(data.value)}>
                <Tab value="daily">Daily View</Tab>
                <Tab value="monthly">Monthly View</Tab>
                <Tab value="all">All Expenses</Tab>
            </TabList>

            {renderView()}
        </div>
    );
};

export default Home;

