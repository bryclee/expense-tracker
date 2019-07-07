import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { getEntries, getSpreadsheets } from '../api';

async function loadEntriesForUser() {
  let entries = [];

  try {
    const spreadsheets = await getSpreadsheets();

    entries = await getEntries(spreadsheets[0].id);
  } catch (err) {
    console.log('Error from loadEntriesForUser:', err);
    throw err;
  }

  return entries;
}

type EntryDisplay = {
  id: string;
  name: string;
  date: string;
  category: string;
  amount: string;
};

function mapEntry({ id, name, date, category, amount }: Entry): EntryDisplay {
  return {
    id,
    name,
    date,
    category,
    amount,
  };
}

const Entries = () => {
  const [entries, updateEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    let mounted = true;

    loadEntriesForUser()
      .then(entries => {
        if (mounted) {
          setLoading(false);
          updateEntries(entries);
        }
      })
      .catch(err => {
        console.log('entries error', err);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <td>Date</td>
          <td>Name</td>
          <td>Category</td>
          <td>Amount</td>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id} className={styles.entry}>
            <td className={styles.date}>{entry.date}</td>
            <td className={styles.name}>{entry.name}</td>
            <td className={styles.category}>{entry.category}</td>
            <td className={styles.amount}>{entry.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Entries;
