import React, { useEffect } from 'react'
import styles from './index.module.css'
import { getEntries, getSpreadsheets } from '../api'

async function loadEntriesForUser() {
  let entries = []

  try {
    const spreadsheets = await getSpreadsheets()

    entries = await getEntries(spreadsheets[0].id)
  } catch (err) {
    console.log('error:', err)
  }

  return entries
}

const Entries = () => {
  useEffect(() => {
    loadEntriesForUser().then(entries => {
      console.log(entries)
    })
  })
  return <div>entries go here</div>
}

export default Entries
