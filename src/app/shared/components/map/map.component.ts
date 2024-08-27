import {
  Component, ElementRef, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, SimpleChanges,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';

// Services
import { UserService } from 'src/app/core/services/user/user.service';
import { MapDataService } from 'src/app/shared/services/map-data.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @Input() mapStyles: { [key: string]: string } = {};
  @Input() containerStyle: { [key: string]: string } = {};
  @Input() isEditable = false;
  @Output() formattedAddressChange = new EventEmitter<string>();
  @Output() userLocationChange = new EventEmitter<google.maps.LatLngLiteral>();
  @Output() routeResultChange = new EventEmitter<google.maps.DirectionsResult>();

  private map: google.maps.Map | null = null;
  private destroy$ = new Subject<void>();

  autocomplete: google.maps.places.Autocomplete | null = null;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  userLocation: google.maps.LatLngLiteral | null = null;
  currentLocation: GeolocationPosition | null = null;
  formattedAddress: string = '';
  routeResult: google.maps.DirectionsResult | null = null;
  API_KEY: string = environment.firebase.apiKey;
  userId: string = '';
  user: any = {};

  constructor(
    private mapDataService: MapDataService,
    private route: ActivatedRoute,
    private _userService: UserService,
    private cdr: ChangeDetectorRef,
    private platform: Platform
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

    this.mapDataService.formattedAddress$.
      pipe(takeUntil(this.destroy$))
      .subscribe(address => this.formattedAddress = address
      );

    this.mapDataService.userLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (location) => {
        this.userLocation = location;
        if (location && this.map) {
          await this.handleNewLocation(location);
        }
      });

    try {
      await loader.importLibrary('maps');
      await this.setLocation();
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
    this.initializeAutocomplete();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map);
      this.map = null as google.maps.Map | null;
    }

    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
      this.autocomplete = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isEditable']) {
      this.isEditable = changes['isEditable'].currentValue;
    }
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

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  async initializeAutocomplete() {
    this.autocomplete = new google.maps.places!.Autocomplete(
      this.searchInput.nativeElement, {
      types: ['geocode'],
      componentRestrictions: { country: "cr" },
      fields: ["place_id", "name", "geometry"]
    });

    // Event listener for place selection
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete!.getPlace();
      if (place && place.geometry) {
        const coords = place.geometry.location!.toJSON();
        this.handleNewLocation(coords);
      } else {
        console.error('Place not found:', place);
      }
    });
  }

  async setLocation() {
    if (this.userLocation) {
      await this.handleNewLocation(this.userLocation);
    } else if (this.user.lat && this.user.lng) {
      await this.handleNewLocation({ lat: this.user.lat, lng: this.user.lng });
    } else {
      this.getCurrentLocation();
    }
  }

  /**
   * The function `getCurrentLocation` asynchronously retrieves the user's current geolocation position
   * if supported by the browser.
   * @returns The `getCurrentLocation` function returns a Promise that resolves to a
   * `GeolocationPosition` object representing the user's current position.
   */
  async getCurrentLocation() {
    // Check if geolocation is supported by the browser.
    if (this.platform.is('android')) {
      const response = await Geolocation.requestPermissions();
      if (response.location === 'denied') {
        this.showLocationPermissionDialog();
        return;
      }
      await Geolocation.getCurrentPosition().then((position) => {
        this.handleNewLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    } else {
      await navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state !== 'granted') {
          navigator.geolocation;
        }
      });
      // Get the user's current position
      this.currentLocation = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      this.handleNewLocation({ lat: this.currentLocation.coords.latitude, lng: this.currentLocation.coords.longitude });
    }
  }

  private showLocationPermissionDialog(): void {
    alert('Los permisos de ubicación fueron denegados, para continuar favor de aceptarlos en la configuración del dispositivo.');
  }

  private async handleNewLocation(location: { lat: number, lng: number }) {
    this.setCoords(location.lat, location.lng);
    await this.getAddressFromCoords(location.lat, location.lng);
    this.initMap();
    this.setMarker();
    this.map!.panTo(location);
  }

  /**
   * The `setMarker` function asynchronously creates a draggable marker on a map, allowing users to
   * update their location and retrieve address information based on the marker's position.
   */
  async setMarker() {
    if (this.userLocation) {
      this.map!.setCenter(this.userLocation);
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
  }

  /**
   * The function `getAddressFromCoords` uses the Google Maps Geocoding API to retrieve the formatted
   * address based on the provided coordinates.
   * @param {GeolocationCoordinates} coords - The `coords` parameter in the `getAddressFromCoords`
   * function is of type `GeolocationCoordinates`. This object typically contains information about the
   * geographical coordinates, including latitude and longitude, obtained from a geolocation service or
   * device.
   */
  async getAddressFromCoords(lat: number, lng: number) {
    const latLng = new google.maps.LatLng(lat, lng); // Create a new LatLng object
    const geocoder = new google.maps.Geocoder(); // Create a new Geocoder object

    // Use the geocoder to get the formatted address based on the coordinates
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results) {
        this.formattedAddress = results[0].formatted_address;
        this.formattedAddressChange.emit(this.formattedAddress); // Emit the formatted address to the parent component
        this.cdr.markForCheck();
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  }
}