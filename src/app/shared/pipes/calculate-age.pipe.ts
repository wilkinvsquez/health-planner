import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateAge',
  standalone: true,
})
export class CalculateAgePipe implements PipeTransform {
  transform(birthDate: string): number {
    const today = new Date();
    const birthDateObj = parseDate(birthDate);
    if (isNaN(birthDateObj.getTime())) {
      throw new Error('Invalid date format');
    }
    const diff = today.getTime() - birthDateObj.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age;
  }
}

function parseDate(dateString: string): Date {
  const [day, month, year] = dateString
    .split('/')
    .map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
}
