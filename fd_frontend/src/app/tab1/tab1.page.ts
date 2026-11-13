import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CategorieScrollComponent } from '../home/categorie-scroll/categorie-scroll.component';
import { ProductsListComponent } from "../home/products-list/products-list.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CategorieScrollComponent, ProductsListComponent],
})
export class Tab1Page {
  constructor() {}
}
