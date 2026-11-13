import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { OrdiniFattorinoComponent } from '../fattorino/ordini-fattorino/ordini-fattorino.component';

@Component({
  selector: 'app-tab-ordini-fattorino',
  templateUrl: './tab-ordini-fattorino.page.html',
  styleUrls: ['./tab-ordini-fattorino.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, OrdiniFattorinoComponent]
})
export class TabOrdiniFattorinoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
