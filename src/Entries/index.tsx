import React, { useEffect } from 'react';
import styles from './index.module.css';
import { getEntries, getSpreadsheets } from '../api';

async function loadEntriesForUser() {
  const spreadsheets = await getSpreadsheets();
  const entries = await getEntries(spreadsheets[0].id);

  return entries;
}

const Entries = () => {
  useEffect(() => {
    loadEntriesForUser().then(entries => {
      console.log(entries);
    });
  });
  return <div>entries go here</div>;
};

export default Entries;
