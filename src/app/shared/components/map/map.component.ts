import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() mapStyles: { [key: string]: string } = {};
  @Output() formattedAddressChange = new EventEmitter<string>();
  @Output() userLocationChange = new EventEmitter<google.maps.LatLngLiteral>();
  @Output() routeResultChange = new EventEmitter<google.maps.DirectionsResult>();

  private map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  userLocation: google.maps.LatLngLiteral | null = null;
  formattedAddress: string = '';
  routeResult: google.maps.DirectionsResult | null = null;
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
      const user = await this._userService.getUserById(this.userId);
      this.user = user.data;
    }

    const loader = new Loader({
      apiKey: this.API_KEY,
      version: 'weekly',
      libraries: ["marker", "places", "routes"],
    });

    this.mapDataService.formattedAddress$.subscribe(
      address => this.formattedAddress = address 
    );
  
    this.mapDataService.userLocation$.subscribe(async (location) => {
      this.userLocation = location;
  
      if (location && this.map) {
        await this.handleNewLocation(location);
      } 
    });
  
    try {
      await loader.importLibrary('maps');
  
      if (this.userLocation) {
        await this.handleNewLocation(this.userLocation);
      } else {
        this.getLocation();
      }
  
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }
  
  private async handleNewLocation(location: { lat: number, lng: number }) {
    this.getAddressFromCoords(location.lat, location.lng);
    this.initMap();
    this.setMarker();
    this.map.panTo(location);
  }

  ngOnDestroy() {
    this.mapDataService.userLocation$.subscribe().unsubscribe();
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

    this.directionsService = new google.maps.DirectionsService(); // Create a new DirectionsService object
    this.directionsRenderer = new google.maps.DirectionsRenderer(); // Create a new DirectionsRenderer object

    // Set the map for the DirectionsRenderer
    // this.directionsRenderer.setMap(this.map);
  }

  /**
 * The `getLocation` function in TypeScript asynchronously retrieves the user's geolocation coordinates
 * and then calls two other functions to get the address and set the coordinates.
 * @returns The `getLocation` function returns `undefined` if geolocation is not supported by the
 * browser, as indicated by the `return;` statement in the error handling block.
 */
  async getLocation() {
    this.initMap();

    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return; // Exit early if geolocation isn't supported
    }

    try {
      // Get the user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // const origin = {
      //   lat: this.user.lat || position.coords.latitude,
      //   lng: this.user.lng || position.coords.longitude,
      // }
      // const destination = {
      //   lat: 10.356291739882927,
      //   lng: -84.43653860495493,
      // }

      // this.calculateRoute(origin, destination);

      this.getAddressFromCoords(
        this.user.lat || position.coords.latitude,
        this.user.lng || position.coords.longitude
      );

      this.setCoords(
        this.user.lat || position.coords.latitude,
        this.user.lng || position.coords.longitude
      );

      this.setMarker();
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  }

  /**
   * The `setMarker` function asynchronously creates a draggable marker on a map, allowing users to
   * update their location and retrieve address information based on the marker's position.
   */
  async setMarker() {
    if (this.userLocation) {
      this.map.setCenter(this.userLocation);
    }

    // Import and use AdvancedMarkerElement
    const { AdvancedMarkerElement } = await google.maps.importLibrary(
      "marker"
    ) as { AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement };

    const marker = new AdvancedMarkerElement({
      position: this.userLocation,
      map: this.map,
      gmpDraggable: true,
    });

    // Add a listener to the marker to update the user's location and address
    marker.addListener("dragend", (event: { latLng: { toJSON: () => any; }; }) => {
      const newPosition = event.latLng.toJSON();
      this.setCoords(newPosition.lat, newPosition.lng);
      this.getAddressFromCoords(newPosition.lat, newPosition.lng);
    });
  }

  /**
   * The setCoords function updates the user's location coordinates and emits an event with the new
   * coordinates while also centering the map on the user's location.
   * @param {number} lat - Latitude coordinate for the user's location
   * @param {number} lng - The `lng` parameter in the `setCoords` function represents the longitude
   * coordinate of a location. It is a numerical value that specifies the east-west position of a point
   * on the Earth's surface.
   */
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

    // Use the geocoder to get the formatted address based on the coordinates
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results) {
        this.formattedAddress = results[0].formatted_address;
        this.formattedAddressChange.emit(this.formattedAddress); // Emit the formatted address to the parent component
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  }

  /**
   * The `calculateRoute` function uses the Google Maps Directions API to calculate and display a driving
   * route between two specified locations.
   * @param origin - The `origin` parameter is the starting point of the route, specified as a
   * `google.maps.LatLngLiteral` object containing the latitude and longitude coordinates of the
   * location.
   * @param destination - The `calculateRoute` function you provided is used to calculate a route between
   * an origin and a destination using the Google Maps Directions API. The `origin` and `destination`
   * parameters are of type `google.maps.LatLngLiteral`, which represents a geographical point as a
   * latitude and longitude coordinate.
   */
  calculateRoute(origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) {
    const request: google.maps.DirectionsRequest = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        // this.directionsRenderer.setDirections(result); // Display the route on the map
        this.routeResult = result; // Store the result
        this.routeResultChange.emit(result!); // emit to parent
        // console.log('Distance:', result!.routes[0].legs[0].distance?.text);
        // console.log('Duration:', result!.routes[0].legs[0].duration?.text);
      } else {
        console.error('Directions request failed:', status);
        this.routeResult = null; // Clear result on error
      }
    });
  }
}
