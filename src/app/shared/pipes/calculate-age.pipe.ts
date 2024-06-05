import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateAge',
  standalone: true,
})
export class CalculateAgePipe implements PipeTransform {
  transform(birthDate: string): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const diff = today.getTime() - birthDateObj.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    console.log('age', age);
    return age;
  }
}
