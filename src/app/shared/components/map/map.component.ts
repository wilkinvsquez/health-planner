import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

import { environment } from 'src/environments/environment';

import { MapDataService } from 'src/app/shared/services/map-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() mapStyles: { [key: string]: string } = {};
  @Output() formattedAddressChange = new EventEmitter<string>();

  private map!: google.maps.Map;
  userLocation: google.maps.LatLngLiteral | null = null;
  formattedAddress: string = '';
  API_KEY: string = environment.firebase.apiKey;

  constructor(private mapDataService: MapDataService) { }

  async ngOnInit() {
    // Create a new Loader object with the API key and required libraries
    const loader = new Loader({
      apiKey: this.API_KEY,
      version: 'weekly',
      libraries: ["marker", "places"],
    });

    // Load the Google Maps library
    try {
      await loader.importLibrary('maps');
      this.initMap();
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }

    // Subscribe to the formatted address from the MapDataService
    this.mapDataService.formattedAddress$.subscribe(
      newAddress => this.formattedAddress = newAddress
    );
  }

  /**
   * The `initMap` function initializes a Google Map centered at coordinates (0, 0) with a zoom level of
   * 15 and a specified map ID using the provided API key.
   */
  initMap() {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 0, lng: 0 },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      keyboardShortcuts: false,
      mapId: this.API_KEY,
    });
    this.setMarker();
  }

  /**
   * The `setMarker` function retrieves the user's geolocation, centers the map on their location, and
   * creates a marker at that position using AdvancedMarkerElement.
   */
  async setMarker() {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return; // Exit early if geolocation isn't supported
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      this.getAddressFromCoords(position.coords);

      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.map.setCenter(this.userLocation);

      // Import and use AdvancedMarkerElement
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      ) as { AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement };

      const marker = new AdvancedMarkerElement({
        position: this.userLocation,
        map: this.map,
        gmpDraggable: true,
      });

      marker.addListener("dragend", (event: { latLng: { toJSON: () => any; }; }) => {
        const newPosition = event.latLng.toJSON();
        this.getAddressFromCoords({
          latitude: newPosition.lat,
          longitude: newPosition.lng,
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        });
      });
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  }

  /**
   * The function `getAddressFromCoords` uses the Google Maps Geocoding API to retrieve the formatted
   * address based on the provided coordinates.
   * @param {GeolocationCoordinates} coords - The `coords` parameter in the `getAddressFromCoords`
   * function is of type `GeolocationCoordinates`. This object typically contains information about the
   * geographical coordinates, including latitude and longitude, obtained from a geolocation service or
   * device.
   */
  getAddressFromCoords(coords: GeolocationCoordinates) {
    const latLng = new google.maps.LatLng(coords.latitude, coords.longitude); // Create a new LatLng object
    const geocoder = new google.maps.Geocoder(); // Create a new Geocoder object
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results) {
        this.formattedAddress = results[0].formatted_address;
        this.formattedAddressChange.emit(this.formattedAddress); // Emit the formatted address to the parent component
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  }
}
