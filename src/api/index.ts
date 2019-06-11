import { ApiError } from './ApiError';

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

// TODO: This should have a way to set and consume the access token
async function requestToServer<T>(
  uri: RequestInfo,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(uri, options);
  const data = await res.json();

  if (res.status !== 200) {
    throw new ApiError(data.message || res.status, {
      status: res.status,
      data: data
    });
  }

  return data;
}

export async function getSpreadsheets(): Promise<Spreadsheet[]> {
  return requestToServer<Spreadsheet[]>(`/api/spreadsheets`);
}

export async function getEntries(id: string): Promise<Entry[]> {
  return requestToServer<Entry[]>(`/api/spreadsheets/${id}/entries`);
}
