import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import {
  makeStyles,
  Input,
  Button,
  Text,
  Field,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Spinner
} from "@fluentui/react-components";

import { Add24Regular, Delete24Regular , AppsListRegular} from "@fluentui/react-icons";
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
          alignItems: 'stretch',
      },
  },
  expenseForm: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
      alignItems: 'flex-end',
      '@media (max-width: 768px)': {
          flexDirection: 'column',
          gap: '8px',
          '& > *': {
              width: '100%',
          },
      },
  },
  expenses: {
      marginTop: '20px',
      width: '100%',
      overflowX: 'auto',
  },
  table: {
      width: '100%',
      '@media (max-width: 768px)': {
          '& th, & td': {
              padding: '8px 4px',
              fontSize: '0.9rem',
          },
      },
  },
  deleteButton: {
      minWidth: 'auto',
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
  
});


const DailyView = () => {
  const styles = useStyles();
  const { currentUser } = useAuth();
  // const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ itemName: '', amount: '' });
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/api/expense/getExpensesByDateAndEmail/${selectedDate}/${currentUser.email}`
      );
      // If the response is plain text (No Expense Found)
      if (response.status === 404) {
        setExpenses([]);  // Set expenses to empty array
      } else {
        const data = await response.json();  // Otherwise, parse as JSON
        setExpenses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      logger.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async () => {
    if (!newExpense.itemName || !newExpense.amount) return;

    setIsLoading(true);
    try {
      // Format the date in dd-MM-yyyy format
      const formattedDate = new Date(selectedDate)
        .toLocaleDateString('en-GB')  // 'en-GB' locale provides dd-MM-yyyy format
        .split('/').join('-'); // Converts the date to dd-MM-yyyy format
      const response = await fetch(`${config.apiUrl}/api/expense/addExpense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: newExpense.itemName,
          amount: parseFloat(newExpense.amount),
          date: formattedDate, // Use the formatted date
          userEmail: currentUser.email,
        }),
      });

      if (response.ok) {
        setNewExpense({ itemName: '', amount: '' });
        fetchExpenses();
      }
    } catch (error) {
      logger.error('Error adding expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Calculate the total expense
  const getTotalExpense = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedDate]);

  return (
    <div className={styles.container}>
      <div className={styles.dateContainer}>
        <Field label="Select Date">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={isLoading}
          />
        </Field>
        <Button onClick={fetchExpenses} disabled={isLoading}>
          {isLoading ? (<><Spinner size="tiny" />' Loading...'</>) : 'Go'}
        </Button>
      </div>

      <div className={styles.expenses}>
        <Table className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Sl.No.</TableHeaderCell>
              <TableHeaderCell>Item</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expenses.indexOf(expense) + 1}</TableCell>
                <TableCell>{expense.itemName}</TableCell>
                <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    appearance="subtle"
                    onClick={() => deleteExpense(expense.id)}
                    disabled={isLoading}
                    className={styles.deleteButton}
                    icon={<Delete24Regular />}

                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Text align="center">No expenses found for this date</Text>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total Expense */}
      {expenses.length > 0 && (
        <div className={styles.total}>
          <Text className={styles.total}>Total Expense: ₹{getTotalExpense()}</Text>
        </div>
      )}

      <div className={styles.expenseForm}>
        <Field label="Item Name">
          <Input
          contentBefore={<AppsListRegular> </AppsListRegular>}
            value={newExpense.itemName}
            onChange={(e) => setNewExpense({ ...newExpense, itemName: e.target.value })}
            placeholder="Enter item name"
            disabled={isLoading}
            />
        </Field>
        <Field label="Amount">
          <Input
            contentBefore={<Text>₹</Text>}
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder="Enter amount"
            disabled={isLoading}
            
          />
        </Field>
        <Button
          icon={<Add24Regular />}
          onClick={addExpense}
          appearance="primary"
          disabled={isLoading}
        >
          Add Expense
        </Button>
      </div>
    </div>
  );
};

export default DailyView;

