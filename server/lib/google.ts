const MS_TO_DAY = 1000 * 60 * 60 * 24;

/**
 * Formats a date
 */
export function formatDateForSheets(date: string): number {
  const userDate = new Date(date);

  if (Number.isNaN(userDate.valueOf())) {
    throw new Error('Invalid date');
  }

  const startDate = new Date('12/30/1900');

  return (userDate.valueOf() - startDate.valueOf()) / MS_TO_DAY;
}
