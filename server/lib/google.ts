const MS_TO_DAY = 1000 * 60 * 60 * 24;
const GOOGLE_START_DAY = new Date('12/30/1899').valueOf();

function msToDays(dateNumber: number): number {
  return Math.floor(dateNumber / MS_TO_DAY);
}

/**
 * Formats a date according to the number of days from 12/30/1899, the date google uses as epoch
 */
export function formatDateForSheets(date: string | number): number {
  const userDate = new Date(date).valueOf();

  if (Number.isNaN(userDate)) {
    throw new Error('Invalid date');
  }

  return msToDays(userDate) - msToDays(GOOGLE_START_DAY);
}
