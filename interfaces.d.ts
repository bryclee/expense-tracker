type SpreadsheetsResponse = Spreadsheet[];
type EntriesResponse = Entry[];

type Spreadsheet = {
  id: string;
  name: string;
};

type Entry = {
  id: string;
  name: string;
  category: string;
  amount: string;
  date: string;
};

type AddEntryPayload = {
  date: string;
  name: string;
  amount: string;
  category: string;
};
