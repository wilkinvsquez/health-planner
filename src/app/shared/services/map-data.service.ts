import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapDataService {
    // BehaviorSubjects to store the formatted address and user location
    private formattedAddressSource = new BehaviorSubject<string>('');
    formattedAddress$ = this.formattedAddressSource.asObservable();

    // BehaviorSubject to store the user's location
    private userLocationSource = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
    userLocation$ = this.userLocationSource.asObservable();

    // Functions to update the formatted address and user location
    updateFormattedAddress(newAddress: string) {
        this.formattedAddressSource.next(newAddress);
    }
    
    // Function to update the user's location
    updateUserLocation(newLocation: google.maps.LatLngLiteral | null) {
        this.userLocationSource.next(newLocation);
    }
}