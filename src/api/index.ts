import { GOOGLE_AT_HEADER, GOOGLE_AUTH_HEADER } from '../constants';
import { ApiError } from './ApiError';

interface ApiContext {
  accessToken?: string;
  idToken?: string;
}

let apiContext: ApiContext = {
  accessToken: null,
  idToken: null,
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
  const data = await res.json();

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

export async function getEntries(id: string): Promise<Entry[]> {
  return requestToServer<Entry[]>(`/api/spreadsheets/${id}/entries`);
}
