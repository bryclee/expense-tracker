import React, { useState, useEffect } from 'react';
import { addEntry, getSpreadsheets } from '../api';

const AddForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    getSpreadsheets().then(result => {
      if (!isMounted) return;
      setSpreadsheetId(result[0].id);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const submitHandler = event => {
    event.preventDefault();
    setLoading(true);
    addEntry(spreadsheetId, {
      name: 'asdf',
      category: 'asdf',
      amount: '12.10',
      date: '12/01/2022',
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Add Entry</h1>
      <input type="text" name="name" />
      <select name="category" required>
        <option value=""></option>
        <option value="Food">Food</option>
        <option value="Utilities">Utilities</option>
        <option value="Transportation">Transportation</option>
        <option value="House">House</option>
        <option value="Fun">Fun</option>
        <option value="Misc">Misc</option>
      </select>
      <input type="text" name="amount" />
      <button type="submit" disabled={loading}>
        Save
      </button>
    </form>
  );
};

export default AddForm;
