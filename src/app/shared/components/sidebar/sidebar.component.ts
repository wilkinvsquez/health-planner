import { Component, Input, OnInit, Output } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Platform } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [MapComponent, BlockUIModule, PanelModule, CommonModule]
})
export class SidebarComponent implements OnInit {
  @Input() selectedAppointment: any
  @Output() onDeleteAppointment: EventEmitter<any> = new EventEmitter<any>();

  isEditing: Boolean = false;


  constructor(private platform: Platform) { }

  ngOnInit() { }

  onAddressChange(newAddress: string) {
    this.selectedAppointment.location.address = newAddress;
  }

  openInGoogleMaps() {
    const userLat = this.selectedAppointment.location.lat;
    const userLng = this.selectedAppointment.location.lng;

    let mapUrl: string = '';

    if (this.platform.is('android')) {
      mapUrl = `geo:0,0?q=${userLat},${userLng}`;
    } else {
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${userLat},${userLng}`;
    }
    window.open(mapUrl, '_system');
  }

  onSidebarOpen() {
    this.onDeleteAppointment.emit(this.selectedAppointment);
  }

}
