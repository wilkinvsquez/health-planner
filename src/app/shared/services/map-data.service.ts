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

    // BehaviorSubject to store the route result
    private routeResultSource = new BehaviorSubject<google.maps.DirectionsResult | null>(null);
    routeResult$ = this.routeResultSource.asObservable();

    // Functions to update the formatted address and user location
    updateFormattedAddress(newAddress: string) {
        this.formattedAddressSource.next(newAddress);
    }
    
    // Function to update the user's location
    updateUserLocation(newLocation: google.maps.LatLngLiteral | null) {
        this.userLocationSource.next(newLocation);
    }

    // Function to update the route result
    updateRouteResult(newRouteResult: google.maps.DirectionsResult | null) {
        this.routeResultSource.next(newRouteResult);
    }
}