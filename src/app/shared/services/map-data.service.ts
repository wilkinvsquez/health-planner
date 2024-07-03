import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapDataService {
    private formattedAddressSource = new BehaviorSubject<string>('');
    formattedAddress$ = this.formattedAddressSource.asObservable();

    private userLocationSource = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
    userLocation$ = this.userLocationSource.asObservable();

    updateFormattedAddress(newAddress: string) {
        this.formattedAddressSource.next(newAddress);
    }

    updateUserLocation(newLocation: google.maps.LatLngLiteral | null) {
        this.userLocationSource.next(newLocation);
    }
}