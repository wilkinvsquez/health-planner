import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map!: google.maps.Map;
  userLocation: google.maps.LatLngLiteral | null = null;

  API_KEY: string = environment.firebase.apiKey;

  constructor() { }

  async ngOnInit() {
    const loader = new Loader({
      apiKey: this.API_KEY,
      version: 'weekly',
      libraries: ["marker", "geocoding", "places"],
    });

    try {
      await loader.importLibrary('maps'); // Import the Maps library
      this.initMap();
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }

  initMap() {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 0, lng: 0 },
      zoom: 15,
      mapId: this.API_KEY,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Center the map on the user's location
        this.map.setCenter(this.userLocation);

        // Import and use AdvancedMarkerElement
        const { AdvancedMarkerElement } = await google.maps.importLibrary(
          "marker"
        ) as { AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement };
        
        // Create a new marker at the user's location
        new AdvancedMarkerElement({
          position: this.userLocation,
          map: this.map,
        });
      },
        (error) => {
          console.error('Error getting user location:', error);
        });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
