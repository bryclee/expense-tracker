import { GOOGLE_AT_HEADER, GOOGLE_AUTH_HEADER } from '../constants';
import { ApiError } from './ApiError';
import { getDb } from './db';

interface ApiContext {
  accessToken?: string;
  idToken?: string;
  userId?: string;
}

let apiContext: ApiContext = {
  accessToken: null,
  idToken: null,
  userId: null,
};

/**
 * Set api context variables like the access token for use for all API calls
 */
export function setApiContext(context: ApiContext): void {
  apiContext = {
    ...apiContext,
    ...context,
  };
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
      [GOOGLE_AT_HEADER]: apiContext.accessToken,
      [GOOGLE_AUTH_HEADER]: apiContext.idToken,
      'content-type': 'application/json',
      ...headers,
    },
  };
}

async function requestToServer<T>(
  uri: RequestInfo,
  options: RequestInit = {},
): Promise<T> {
  const apiOptions = buildRequestOptions(options);
  const res = await fetch(uri, apiOptions);
  let rawData;
  let data;

  try {
    rawData = await res.text();
    data = JSON.parse(rawData);
  } catch (err) {
    data = {};
    // noop
  }

  if (res.status !== 200) {
    throw new ApiError(data.message || res.status, {
      status: res.status,
      data: data,
    });
  }

  return data;
}

export async function getSpreadsheets(): Promise<Spreadsheet[]> {
  return requestToServer<Spreadsheet[]>(`/api/spreadsheets`);
}

/**
 * Returns the primary spreadsheet ID to be used for the user
 */
export async function getSpreadsheetId(): Promise<string> {
  const spreadsheets = await getSpreadsheets();

  return spreadsheets[0].id;
}

export async function getEntries(id: string): Promise<Entry[]> {
  return requestToServer<Entry[]>(`/api/spreadsheets/${id}/entries`);
}

export async function addEntry(
  id: string,
  payload: AddEntryPayload,
): Promise<void> {
  await getDb();
  return requestToServer<void>(`/api/spreadsheets/${id}/entries`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
