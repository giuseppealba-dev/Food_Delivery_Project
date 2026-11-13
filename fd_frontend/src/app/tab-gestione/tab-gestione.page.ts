import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AddProductComponent } from '../admin/add-product/add-product.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tab-gestione',
  templateUrl: './tab-gestione.page.html',
  styleUrls: ['./tab-gestione.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterOutlet]
})
export class TabGestionePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
