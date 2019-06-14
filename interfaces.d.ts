type SpreadsheetsResponse = Spreadsheet[];
type EntriesResponse = Entry[];

interface Spreadsheet {
  name: string;
  id: string;
}

interface Entry {
  name: string;
  category: string;
  amount: string;
  date: string;
}
