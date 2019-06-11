import { ApiError } from './ApiError';

interface ApiContext {
  accessToken?: string;
}

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

const apiContext: ApiContext = {
  accessToken: null
};

/**
 * Set the access token for use for all API calls
 */
export function setAccessToken(token: string): void {
  apiContext.accessToken = token;
}

/**
 * Formats options, adding default values such as access token that are needed for the application
 */
function buildRequestOptions({
  headers = {},
  ...options
}: RequestInit): RequestInit {
  return {
    ...options,
    headers: {
      accessToken: apiContext.accessToken,
      ...headers
    }
  };
}

async function requestToServer<T>(
  uri: RequestInfo,
  options: RequestInit = {}
): Promise<T> {
  const apiOptions = buildRequestOptions(options);
  const res = await fetch(uri, apiOptions);
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
