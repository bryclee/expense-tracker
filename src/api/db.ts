const EXPENSE_DB_VERSION = 1;

enum STORES {
  APP_DATA = 'appData',
  ENTRIES = 'entries',
}

enum APP_DATA_KEYS {
  SPREADSHEET_ID = 'spreadsheetId',
}

export function isSupported(): boolean {
  return !!window.indexedDB;
}

function memo<T extends (...args: any[]) => any>(
  fn: T,
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  let _cached: ReturnType<T>;

  return (...args: Parameters<T>): ReturnType<T> => {
    if (!_cached) {
      _cached = fn(...args);
    }

    return _cached;
  };
}

async function _getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const openDbRequest = window.indexedDB.open(
      'ExpenseDb',
      EXPENSE_DB_VERSION,
    );

    openDbRequest.onupgradeneeded = () => {
      const db = openDbRequest.result;

      db.createObjectStore(STORES.APP_DATA);
      const entries = db.createObjectStore(STORES.ENTRIES, { keyPath: 'id' });

      entries.createIndex('date', 'date');
      entries.createIndex('category', 'category');
    };

    openDbRequest.addEventListener('success', () => {
      resolve(openDbRequest.result);
    });

    openDbRequest.addEventListener('error', () => {
      // TODO: handle version error (VER_ERR) with prompt to reload app
      reject(openDbRequest.error);
    });

    // TODO: handle the "blocked" event, if there is another tab open using an old version of the DB
  });
}

export const getDb = memo(_getDb);

// TODO: Should it return transaction or object stores? Right now it doesn't return data
async function createTransaction<T>(
  db: IDBDatabase,
  stores: string,
  mode: IDBTransactionMode,
  handler: (stores: IDBObjectStore) => void,
): Promise<T>;
async function createTransaction<T>(
  db: IDBDatabase,
  stores: string[],
  mode: IDBTransactionMode,
  handler: (stores: IDBObjectStore[]) => void,
): Promise<T>;
async function createTransaction<T>(
  db: IDBDatabase,
  stores: any,
  mode: IDBTransactionMode,
  handler: any,
): Promise<T> {
  const transaction = db.transaction(stores, mode);
  let dbStores: IDBObjectStore | IDBObjectStore[];

  if (Array.isArray(stores)) {
    dbStores = stores.map(store => transaction.objectStore(store));
  } else {
    dbStores = transaction.objectStore(stores);
  }

  handler(dbStores);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = err => reject(err);
  });
}

export async function readSpreadsheetId(
  db: IDBDatabase,
): Promise<string | null> {
  return createTransaction(db, STORES.APP_DATA, 'readonly', appDataStore => {
    return new Promise((resolve, reject) => {
      const readReq = appDataStore.get(APP_DATA_KEYS.SPREADSHEET_ID);

      readReq.onsuccess = () => resolve(readReq.result);
      readReq.onerror = () => reject(readReq.error);
    });
  });
}

export async function writeSpreadsheetId(
  db: IDBDatabase,
  id: string,
): Promise<void> {
  return createTransaction(db, STORES.APP_DATA, 'readwrite', appDataStore => {
    appDataStore.put(id, APP_DATA_KEYS.SPREADSHEET_ID);
  });
}

export async function readEntries(db: IDBDatabase): Promise<Entry[]> {
  return createTransaction(db, STORES.ENTRIES, 'readonly', entriesStore => {
    return new Promise((resolve, reject) => {
      const readReq = entriesStore.getAll();

      readReq.onsuccess = () => resolve(readReq.result);
      readReq.onerror = () => reject(readReq.error);
    });
  });
}

export async function writeEntries(
  db: IDBDatabase,
  entries: Entry[],
): Promise<void> {
  return createTransaction(db, STORES.ENTRIES, 'readwrite', entriesStore => {
    entries.forEach(entry => {
      entriesStore.put(entry, entry.id);
    });
  });
}
