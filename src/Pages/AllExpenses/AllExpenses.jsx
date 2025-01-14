import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionPanel,
    Text,
    Table,
    TableHeader,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    makeStyles,
    Button,
    Spinner,
} from "@fluentui/react-components";

import { AccessTime20Filled, ArrowSyncRegular } from "@fluentui/react-icons";
import { config, logger } from '../../config/env';


const parseDateFromBackend = (dateString) => {
    // Split the dd-MM-yyyy format and rearrange to yyyy-MM-dd for Date parsing
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
};

const useStyles = makeStyles({
    total: {
        textAlign: 'right',
        fontWeight: 'bold',
        '@media (max-width: 768px)': {
            textAlign: 'right',
        }
    },
    refreshButton: {
        margin: '10px 0',
    }
});

const AllExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [groupedExpenses, setGroupedExpenses] = useState({});
    const [loading, setLoading] = useState(false); // State to track loading status
    const { currentUser } = useAuth();
    const styles = useStyles();

    const fetchAllExpenses = async () => {
        setLoading(true); // Set loading state to true when fetching starts
        try {
            const response = await fetch(
                `${config.apiUrl}/api/expense/getExpensesByEmail/${currentUser.email}`
            );
            const data = await response.json();
            // Correct the date format for all expenses
            const correctedData = data.map((expense) => ({
                ...expense,
                date: parseDateFromBackend(expense.date),
            }));
            setExpenses(correctedData);
            groupExpensesByYearAndMonth(correctedData);
        } catch (e) {
            logger.error("Error fetching expenses:", e);
        } finally {
            setLoading(false); // Set loading state to false once the fetch is complete
        }
    };

    const groupExpensesByYearAndMonth = (expenses) => {
        const grouped = {};
        expenses.forEach((expense) => {
            const date = new Date(expense.date);
            const year = date.getFullYear();
            const month = date.toLocaleString("default", { month: "long" });

            if (!grouped[year]) {
                grouped[year] = {};
            }

            if (!grouped[year][month]) {
                grouped[year][month] = [];
            }

            grouped[year][month].push(expense);
        });
        setGroupedExpenses(grouped);
    };

    const calculateTotal = (expenses) =>
        expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);

    useEffect(() => {
        fetchAllExpenses();
    }, []); // Fetch the expenses on component mount

    return (
        <div style={{ padding: "20px" }}>
            <Text variant="xLarge">All Expenses</Text>

            {/* Refresh Button with Spinner */}
            <div className={styles.refreshButton}>
                <Button onClick={fetchAllExpenses} disabled={loading}  >
                    {loading ? (
                        <>
                            <Spinner size="tiny" />  Loading...
                        </>
                    ) : (
                        <>
                            <ArrowSyncRegular />Refresh
                        </>
                    )}
                </Button>
            </div>

            <Accordion collapsible>
                {/* Iterate over years */}
                {Object.entries(groupedExpenses).map(([year, months]) => (
                    <AccordionItem key={`year-${year}`} value={year}>
                        <AccordionHeader>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <Text>{year}</Text>
                                <Text className={styles.total}>Total: ₹{calculateTotal(Object.values(months).flat())}</Text>
                            </div>
                        </AccordionHeader>
                        <AccordionPanel>
                            <Accordion collapsible>
                                {/* Iterate over months */}
                                {Object.entries(months).map(([month, monthExpenses]) => (
                                    <AccordionItem key={`month-${year}-${month}`} value={month}>
                                        <AccordionHeader>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                }}
                                            >
                                                <Text>{month}</Text>
                                                <Text className={styles.total}>Total: ₹{calculateTotal(monthExpenses)}</Text>
                                            </div>
                                        </AccordionHeader>
                                        <AccordionPanel>
                                            {/* Display all expenses for the month using Fluent UI Table */}
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHeaderCell>Date</TableHeaderCell>
                                                        <TableHeaderCell>Item</TableHeaderCell>
                                                        <TableHeaderCell>Amount</TableHeaderCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {monthExpenses.map((expense) => (
                                                        <TableRow key={`expense-${expense._id}`}>
                                                            <TableCell>
                                                                {expense.date.toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell>{expense.itemName}</TableCell>
                                                            <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default AllExpenses;
