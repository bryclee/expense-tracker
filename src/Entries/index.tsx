import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import { getEntries, getSpreadsheets } from '../api'

async function loadEntriesForUser() {
  let entries = []

  try {
    const spreadsheets = await getSpreadsheets()

    entries = await getEntries(spreadsheets[0].id)
  } catch (err) {
    console.log('Error from loadEntriesForUser:', err)
    throw err
  }

  return entries
}

const Entries = () => {
  const [entries, updateEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState<Boolean>(true)

  useEffect(() => {
    loadEntriesForUser()
      .then(entries => {
        setLoading(false)
        updateEntries(entries)
      })
      .catch(err => {
        console.log('entries error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {loading
        ? 'Loading...'
        : entries.map(entry => (
            <div key={entry.id}>
              <div>{entry.name}</div>
              <div>{entry.date}</div>
              <div>{entry.category}</div>
              <div>{entry.amount}</div>
            </div>
          ))}
    </div>
  )
}

export default Entries
