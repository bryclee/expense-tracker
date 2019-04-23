interface Entry {
  name: string;
  category: string;
  amount: string;
  date: string;
}

export function getEntries(id : string) : Promise<Entry[]> {
  return fetch(`/api/entries/{$id}`).then(res => {
    if (res.status !== 200) {
      return [];
    }

    return [];
  });
}
