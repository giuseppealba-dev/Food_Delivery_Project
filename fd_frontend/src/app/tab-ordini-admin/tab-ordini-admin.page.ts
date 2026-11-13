import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GestioneOrdiniComponent } from '../admin/gestione-ordini/gestione-ordini.component';

@Component({
  selector: 'app-tab-ordini-admin',
  templateUrl: './tab-ordini-admin.page.html',
  styleUrls: ['./tab-ordini-admin.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, GestioneOrdiniComponent]
})
export class TabOrdiniAdminPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
