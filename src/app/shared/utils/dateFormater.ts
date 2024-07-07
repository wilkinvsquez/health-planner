export function setTimeToDate(dateStr: string, timeStr: string): Date {
  const date = new Date(dateStr);
  const timeMatch = timeStr.match(/\d+/g);
  const periodMatch = timeStr.match(/[AP]M/i);

  if (timeMatch && periodMatch) {
    const [hours, minutes] = timeMatch.map(Number);
    const period = periodMatch[0].toUpperCase();

    date.setUTCHours(period === 'PM' ? hours + 12 : hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
  } else {
    throw new Error('Invalid time format');
  }

  return date;
}
