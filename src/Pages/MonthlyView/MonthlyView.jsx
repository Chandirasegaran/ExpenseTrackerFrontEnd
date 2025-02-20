import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import {
    makeStyles,
    Button,
    Text,
    Field,
    Table,
    TableHeader,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Spinner,
    Dropdown,
    Option,
} from "@fluentui/react-components";
import { Add24Regular, Delete24Regular, CalendarRegular } from "@fluentui/react-icons";
import { config, logger } from '../../config/env';

const useStyles = makeStyles({
    container: {
        marginTop: '20px',
    },
    dateContainer: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        alignItems: 'flex-end',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: '8px',
            '& > *': {
                width: '100%',
            },
        },
    },
    total: {
        textAlign: 'right',
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '20px',
        '@media (max-width: 768px)': {
            textAlign: 'right',
        }
    },
    deleteButton: {
        minWidth: 'auto',
    },
});

const MonthlyView = () => {
    const styles = useStyles();
    const { currentUser } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
    const [expenses, setExpenses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const months = [
        { name: "January", value: "01" },
        { name: "February", value: "02" },
        { name: "March", value: "03" },
        { name: "April", value: "04" },
        { name: "May", value: "05" },
        { name: "June", value: "06" },
        { name: "July", value: "07" },
        { name: "August", value: "08" },
        { name: "September", value: "09" },
        { name: "October", value: "10" },
        { name: "November", value: "11" },
        { name: "December", value: "12" },
    ];

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiUrl}/api/expense/getExpensesByMonthAndEmail/${selectedMonth}/${selectedYear}/${currentUser.email}`);
            if (response.status === 404) {
                setExpenses([]);
                
            } else {
                const data = await response.json();
                setExpenses(data);
            }
        } catch (e) {
            logger.log(e);
        } finally {
            setLoading(false);
        }
    };

    const getTotalExpense = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = 2025; year <= currentYear + 5; year++) {
            years.push(year.toString());
        }
        return years;
    };

    const deleteExpense = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${config.apiUrl}/api/expense/deleteExpense/${id}`,
                { method: 'DELETE' }
            );
            if (response.ok) {
                fetchExpenses();
            }
        } catch (error) {
            logger.error('Error deleting expense:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [selectedMonth, selectedYear]);

    return (
        <div className={styles.container}>
            <div className={styles.dateContainer}>
                <Field label="Month">
                    <Dropdown
                        selectedOptions={[selectedMonth]}
                        placeholder={months.find((month) => month.value === selectedMonth)?.name || "Select a month"}
                        onOptionSelect={(_, data) => setSelectedMonth(data.optionValue)}
                    >
                        {months.map((month) => (
                            <Option key={`month-${month.value}`} value={month.value}>
                                {month.name}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>

                <Field label="Year">
                    <Dropdown
                        selectedOptions={[selectedYear]}
                        placeholder={selectedYear ? selectedYear.toString() : 'Select a year'}
                        onOptionSelect={(_, data) => setSelectedYear(data.optionValue)}
                    >
                        {generateYearOptions().map((year) => (
                            <Option key={`year-${year}`} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>

                <Button onClick={fetchExpenses}>Fetch</Button>
            </div>

            <div className={styles.expenses}>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <Table className={styles.table}>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Sl.No.</TableHeaderCell>
                                    <TableHeaderCell>Date</TableHeaderCell>
                                    <TableHeaderCell>Item Name</TableHeaderCell>
                                    <TableHeaderCell>Amount</TableHeaderCell>
                                    <TableHeaderCell>Action</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.map((expense, index) => (
                                    <TableRow key={expense._id || `expense-${index}`}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell>{expense.itemName}</TableCell>
                                        <TableCell>{expense.amount}</TableCell>
                                        <TableCell>
                                            <Button
                                                appearance="subtle"
                                                onClick={() => deleteExpense(expense.id)}
                                                disabled={loading}
                                                className={styles.deleteButton}
                                                icon={<Delete24Regular />}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className={styles.total}>Total:₹{getTotalExpense()}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MonthlyView;
