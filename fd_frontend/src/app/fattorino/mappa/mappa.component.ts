import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import {IonCard, IonCardContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowBackOutline, homeOutline } from 'ionicons/icons';

// FIX IMPORTANTE per le icone di Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

@Component({
  selector: 'app-mappa',
  templateUrl: './mappa.component.html',
  styleUrls: ['./mappa.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent]
})
export class MappaComponent implements OnInit {

  zoom: number = 15;
  title: string = 'Mappa';
  private map: L.Map | undefined;
  private userMarker: L.Marker | undefined;

  // Coordinate di default (Università di Palermo)
  private defaultLat: number = 38.10216165437551;
  private defaultLng: number = 13.345307324902587;

  private markerIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    addIcons({
      arrowBackOutline, homeOutline
    });
  }

  ngOnInit() {
    // Se non si mette, da problemi
    // Ritarda l'inizializzazione per assicurarsi che l'elemento DOM sia pronto
    setTimeout(() => {
      this.ionViewDidEnter();
    }, 100);
  }

  ionViewDidEnter() {
    this.initMap();
    // this.trackUserLocation();
  }

  ionViewWillLeave() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    console.log('Inizializzazione mappa...');

    // Verifica che l'elemento esista
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Elemento #map non trovato!');
      return;
    }

    // Inizializza la mappa con le coordinate di default
    this.map = L.map('map').setView([this.defaultLat, this.defaultLng], this.zoom);
    console.log('Mappa creata:', this.map);

    // Aggiungi il layer delle tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    console.log('Tile layer aggiunto');

    // Aggiungi un marker iniziale nella posizione di default
    this.addMarker(this.defaultLat, this.defaultLng, 'Punto Delivery', true);
  }

  private async trackUserLocation() {
    try {
      console.log('Tentativo di ottenere la posizione dell\'utente...');

      // Usa l'API del browser se su web
      if (this.isRunningInBrowser()) {
        const position = await this.getBrowserPosition();
        this.updateMapPosition(position.coords.latitude, position.coords.longitude, false);
      } else {
        // Usa Capacitor su dispositivi nativi
        const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        this.updateMapPosition(coordinates.coords.latitude, coordinates.coords.longitude, false);
      }
    } catch (error) {
      console.error('Errore GPS:', error);
      console.log('Uso posizione di default');
      // La mappa è già stata inizializzata con la posizione di default
    }
  }

  // Verifica se è in esecuzione nel browser
  private isRunningInBrowser(): boolean {
    return !(window as any).Capacitor?.isNative;
  }

  // Ottieni posizione con API browser
  private getBrowserPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation non supportata dal browser');
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      }
    });
  }

  // Aggiunge un marker alla mappa
  private addMarker(lat: number, lng: number, message: string, isDefault: boolean = false) {
    if (!this.map) return;

    const userLatLng: L.LatLngExpression = [lat, lng];

    // Rimuovi il marker precedente se esiste
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
    }

    // Crea nuovo marker
    this.userMarker = new L.Marker(userLatLng, {
      icon: this.markerIcon,
      draggable: false
    })
      .addTo(this.map)
      .bindPopup(message)
      .openPopup();

    console.log(`Marker aggiunto a: ${lat}, ${lng} - ${message}`);
  }

  // Aggiorna mappa con le coordinate
  private updateMapPosition(lat: number, lng: number, isFallback: boolean = false) {
    if (!this.map) return;

    const message = isFallback ? 'Posizione di default' : 'Sei qui!';

    // Aggiungi il marker
    this.addMarker(lat, lng, message, isFallback);

    // Centra la mappa sulla nuova posizione
    this.map.setView([lat, lng], this.zoom);

    console.log(`Mappa aggiornata a: ${lat}, ${lng}`);
  }

  backPage() {
    this.router.navigate(['/user/profile']);
  }

  changePage(page: string) {
    console.log('/' + page);
    this.router.navigate(['/' + page]);
  }
}
