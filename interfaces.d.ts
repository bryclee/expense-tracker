type SpreadsheetsResponse = Spreadsheet[]
type EntriesResponse = Entry[]

interface Spreadsheet {
  id: string
  name: string
}

interface Entry {
  id: string
  name: string
  category: string
  amount: string
  date: string
}
