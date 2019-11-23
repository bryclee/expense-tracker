import React from 'react';
import styles from './index.module.css';

export type EntryDisplay = {
  id: string;
  name: string;
  date: string;
  category: string;
  amount: string;
};

export const EntriesList = ({ entries }: { entries: EntryDisplay[] }) => {
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
