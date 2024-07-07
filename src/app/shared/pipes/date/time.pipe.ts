import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time_central',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // La hora '0' debe ser '12'

    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }
}
