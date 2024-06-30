import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapDataService {
    private formattedAddressSource = new BehaviorSubject<string>('');
    formattedAddress$ = this.formattedAddressSource.asObservable();

    updateFormattedAddress(newAddress: string) {
        this.formattedAddressSource.next(newAddress);
    }
}