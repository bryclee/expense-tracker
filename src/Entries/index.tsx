import React, { useState, useEffect } from 'react';
import { getEntries, getSpreadsheets } from '../api';
import { EntriesList, EntryDisplay } from './EntriesList';

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

function mapEntry({ id, name, date, category, amount }: Entry): EntryDisplay {
  return {
    id,
    name,
    date,
    category,
    amount,
  };
}

const Loading = () => <div>Loading...</div>;

const Entries = () => {
  const [entries, setEntries] = useState<EntryDisplay[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    let mounted = true;

    loadEntriesForUser()
      .then(entries => {
        if (mounted) {
          setEntries(entries.map(mapEntry));
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

  if (loading) return <Loading />;

  return <EntriesList entries={entries} />;
};

export default Entries;
