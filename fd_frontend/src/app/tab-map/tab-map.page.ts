import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MappaComponent } from '../fattorino/mappa/mappa.component';

@Component({
  selector: 'app-tab-map',
  templateUrl: './tab-map.page.html',
  styleUrls: ['./tab-map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MappaComponent]
})
export class TabMapPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
