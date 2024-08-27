export function setTimeToDate(dateStr: string, timeStr: string): Date {
  const date = new Date(dateStr);
  const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);

  if (timeMatch) {
    const [_, hours, minutes] = timeMatch.map(Number);

    date.setUTCHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
  } else {
    throw new Error('Invalid time format');
  }

  return date;
}

