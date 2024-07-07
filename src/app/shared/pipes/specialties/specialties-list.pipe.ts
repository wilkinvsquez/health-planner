import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specialtiesList',
  standalone: true,
})
export class SpecialtiesListPipe implements PipeTransform {
  transform(value: string[]): string {
    if (!value || !Array.isArray(value)) return '';
    return value.join(', ');
  }
}
