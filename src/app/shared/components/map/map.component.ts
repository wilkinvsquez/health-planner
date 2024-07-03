import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter, output } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';

import { environment } from 'src/environments/environment';

// Services
import { UserService } from 'src/app/core/services/user/user.service';
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
  @Output() userLocationChange = new EventEmitter<google.maps.LatLngLiteral>();

  private map!: google.maps.Map;
  userLocation: google.maps.LatLngLiteral | null = null;
  formattedAddress: string = '';
  API_KEY: string = environment.firebase.apiKey;
  userId: string = '';
  user: any = {};

  constructor(
    private mapDataService: MapDataService,
    private route: ActivatedRoute,
    private _userService: UserService
  ) {
    this.userId = this.route.snapshot.params['id'] ? this.route.snapshot.params['id'] : getAuth().currentUser?.uid;
  }

  async ngOnInit() {
    if (this.userId) {
      await this._userService.getUserById(this.userId).then((user) => {
        this.user = user.data;
      });
    }

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

    this.mapDataService.userLocation$.subscribe(
      newLocation => this.userLocation = newLocation
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

      this.getAddressFromCoords(
        this.user.lat || position.coords.latitude,
        this.user.lng || position.coords.longitude
      );

      this.setCoords(
        this.user.lat || position.coords.latitude,
        this.user.lng || position.coords.longitude
      );

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
        this.setCoords(newPosition.lat, newPosition.lng);
        this.getAddressFromCoords(newPosition.lat, newPosition.lng);
      });
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  }

  setCoords(lat: number, lng: number) {
    this.userLocation = {
      lat: lat,
      lng: lng,
    };

    this.userLocationChange.emit(this.userLocation);
    this.map.setCenter(this.userLocation);
  }

  /**
   * The function `getAddressFromCoords` uses the Google Maps Geocoding API to retrieve the formatted
   * address based on the provided coordinates.
   * @param {GeolocationCoordinates} coords - The `coords` parameter in the `getAddressFromCoords`
   * function is of type `GeolocationCoordinates`. This object typically contains information about the
   * geographical coordinates, including latitude and longitude, obtained from a geolocation service or
   * device.
   */
  getAddressFromCoords(lat: number, lng: number) {
    const latLng = new google.maps.LatLng(lat, lng); // Create a new LatLng object
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
